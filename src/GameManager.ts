import { Manager } from "./Manager";
import { Clock } from "./Clock";

// target number of game steps per secong
const TARGET_STEPS_PER_SECOND = 60;

export class GameManager extends Manager {
  private static _instance = new GameManager();
  /** false if the game is currently running */
  private gameOver = false;
  /** total number of game steps that have been taken*/
  private stepCount = 0;
  /** milliseconds to adjust sleep time by */
  private adjustTime: number;
  /** clock for timing stepa */
  private clock: Clock;
  /** target number of milliseconds per game step */
  private stepTime: number;

  /**
   * Private because managers are supposed to be singleton
   */
  private constructor() {
    super();
    this.setType("Game Manager");
    this.stepTime = (1 / TARGET_STEPS_PER_SECOND) * 1000;
    this.gameOver = false;
    this.adjustTime = 0;
    this.clock = new Clock();
    this.stepTime = (1 / TARGET_STEPS_PER_SECOND) * 1000;
  }

  public getInstance(): GameManager {
    return GameManager._instance;
  }

  /**
   * @param newGameOver new state of the game, true by default
   */
  public setGameOver(newGameOver = true): void {
    this.gameOver = newGameOver;
  }

  /**
   * Run one step of the game loop
   * @param prevIntendedSleepTime the intended sleep time of the last step,
   * necessary for setting adjustTime to account for not sleeping the exact
   * desired amount of time
   */
  public run(prevIntendedSleepTime = 0): void {
    this.stepCount++;
    if (prevIntendedSleepTime != 0) {
      // figure out how long we actually slept
      const actualSleepTime = this.clock.split();
      this.adjustTime = actualSleepTime - prevIntendedSleepTime;
    }
    this.clock.delta();

    // TODO send step events to all interested Entities

    // TODO get input

    // TODO update game world

    // TODO draw current scene to back buffer

    // TODO swap buffers

    // sleep until it's time for the next step
    const elapsedTime = this.clock.split();
    const timeToSleep = this.stepTime - elapsedTime - this.adjustTime;
    this.clock.delta();
    if (!this.gameOver) {
      setTimeout(this.run, timeToSleep);
    }
  }
}

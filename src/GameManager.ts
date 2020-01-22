/**
 * Copyright (C) 2020 Joseph Petitti
 *
 * This file is part of Artimancer, a simple turn-based RPG for the web.
 *
 * Artimancer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * Artimancer is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * Artimancer. If not, see <https://www.gnu.org/licenses/>.
 */

import { Manager } from "./Manager";
import { Clock } from "./Clock";
import { DM } from "./DisplayManager";
import { IM } from "./InputManager";
import { RM } from "./ResourceManager";
import { WM } from "./WorldManager";

// target number of game steps per secong
const TARGET_STEPS_PER_SECOND = 60;

class GameManager extends Manager {
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
  /** whether to log extra info */
  private noisy = true;

  /**
   * Private because managers are supposed to be singleton
   */
  private constructor() {
    super();
    this.setType("Game Manager");
    this.clock = new Clock();
    this.stepTime = (1 / TARGET_STEPS_PER_SECOND) * 1000;
    this.gameOver = false;
    this.adjustTime = 0;
    this.stepTime = (1 / TARGET_STEPS_PER_SECOND) * 1000;
  }

  /**
   * @return the singleton instance of this manager
   */
  public static getInstance(): GameManager {
    return GameManager._instance;
  }

  /**
   * starts up all other managers
   * @override
   */
  public startUp(): void {
    DM.startUp();
    RM.startUp();
    IM.startUp();
    WM.startUp();
    super.startUp();

    this.run();
    if (this.noisy) console.log("GM: successfully started");
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

    // get input
    IM.step();

    // update game world
    WM.step(this.stepCount);

    // sleep until it's time for the next step
    const elapsedTime = this.clock.split();
    const timeToSleep = this.stepTime - elapsedTime - this.adjustTime;
    this.clock.delta();
    if (!this.gameOver) {
      setTimeout(this.run.bind(this), timeToSleep);
    }
  }
}

export const GM = GameManager.getInstance();

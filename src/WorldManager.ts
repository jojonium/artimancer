import { Manager } from "./Manager";
import { World } from "./World";
import { WorldLoading } from "./WorldLoading";

/**
 * The WorldManager manages the game world, including positions of entities and
 * GUI elements
 */
class WorldManager extends Manager {
  /** singleton instance */
  private static _instance = new WorldManager();
  /** current world the game is in */
  private currentWorld: World;
  /** whether to log extra info */
  private noisy = true;

  /**
   * private because WorldManager is supposed to be a singleton
   */
  private constructor() {
    super();
    this.setType("World Manager");
  }

  /**
   * Get the singleton instance of this manager
   */
  public static getInstance(): WorldManager {
    return WorldManager._instance;
  }

  /**
   * sets a new world as the active one and initializes it
   * @param world a new World to enter
   */
  public enterWorld(world: World): void {
    if (this.noisy) console.log(`WM: entering world ${world.getType()}`);
    this.currentWorld = world;
  }

  /**
   * action to be performed every game step
   * @param stepCount number of current step
   */
  public step(stepCount: number): void {
    this.currentWorld.step(stepCount);
  }

  /**
   * Draw the world on the canvas
   * @param canvas the canvas to draw on
   */
  public draw(canvas: HTMLCanvasElement): void {
    canvas.getContext("2d").save();
    this.currentWorld.draw(canvas);
    canvas.getContext("2d").restore();
  }

  /**
   * starts up the World Manager, setting the initial World
   */
  public startUp(): void {
    // enter initial world
    this.enterWorld(new WorldLoading());

    super.startUp();
    if (this.noisy) console.log("World Manager successfully started");
  }
}

export const WM = WorldManager.getInstance();

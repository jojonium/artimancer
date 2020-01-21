import { World } from "./World";
import { Room } from "./Room";

/**
 * This is a world in which the player character can walk around, talk to NPCs,
 * and encounter enemies
 */
export class WorldFreeRoam extends World {
  private currentRoom: Room;

  /**
   * Creates a new WorldFreeRoam
   */
  public constructor() {
    super();
    this.setType("Free Roam");
  }

  /**
   * draws this world
   * @param ctx the canvas context to draw on
   * @param w width of the canvas
   * @param h height of the canvas
   */
  public draw(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    // TODO implement
    this.currentRoom.draw(ctx, w, h);
  }

  /**
   * actions to take each game step
   */
  public step(): void {
    // TODO implement
  }

  /**
   * Sets a new room as the active room
   * @param newRoom the new room the player is in
   */
  public setRoom(newRoom: Room): void {
    this.currentRoom = newRoom;
  }
}

import { Room } from "./Room";
import { WorldFreeRoam } from "./WorldFreeRoam";

/**
 * This class is for development purposes, and allows for easy graphical
 * editing of room backgrounds and collisison boundaries
 */
export class WorldRoomEditor extends WorldFreeRoam {
  /**
   * Constructs a new RoomEditor world for a given room
   * @param room the room to edit
   */
  public constructor(room: Room) {
    super();
    this.setType("Room Editor");
    this.setRoom(room);
  }

  /**
   * draw the room normally, then draw collision boundaries on top of it
   * @override
   * @param ctx the canvas context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    // TODO draw editing boundaries
  }
}

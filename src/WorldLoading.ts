import { World } from "./World";
import { RM } from "./ResourceManager";
import { WM } from "./WorldManager";
import { CANV_SIZE } from "./DisplayManager";
import { WorldRoomEditor } from "./WorldRoomEditor";
import { Room } from "./Room";
import { Vector } from "./Vector";

/**
 * a World that displays a loading bar while resources are being loaded
 */
export class WorldLoading extends World {
  /** what percentage of loading is done so far */
  private percentLoaded: number;

  /**
   * creates this world
   */
  public constructor() {
    super();
    this.setType("Loading");
    this.percentLoaded = 0;
  }

  /**
   * draws a loading bar centered on a gray canvas
   * @param ctx the canvas context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    // draw text
    ctx.font = `bold 50px Bitter`;
    ctx.fillStyle = "#cccccc";
    ctx.textAlign = "center";
    ctx.fillText("Now loading...", CANV_SIZE / 2, CANV_SIZE / 2 - 100);

    // show loading bar
    ctx.fillStyle = "#007acc";
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 8;
    const barHeight = 50;
    const barLength = 750;
    const x = CANV_SIZE / 2 - barLength / 2;
    const y = CANV_SIZE / 2 - barHeight / 2;
    ctx.fillRect(x, y, barLength * this.percentLoaded, barHeight);
    ctx.rect(x, y, barLength, barHeight);
    ctx.stroke();
  }

  /**
   * Each step poll the resource manager for the percent loaded. If done
   * loading, tell the World Manager to move on to the next World
   */
  public step(): void {
    this.percentLoaded = RM.getPercentLoaded();
    if (1 - this.percentLoaded <= 0.01) {
      // TODO move on to next world
      const room = new Room("Test Room");
      room.addBackground(
        RM.getSprite("test-bg"),
        new Vector(500, 300),
        600,
        200,
        0
      );
      WM.enterWorld(new WorldRoomEditor(room));
    }
  }
}

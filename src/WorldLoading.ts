import { World } from "./World";
import { RM } from "./ResourceManager";
import { WM } from "./WorldManager";
import { WorldDisplayTest } from "./WorldDisplayTest";

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
   * @param w width of the canvas
   * @param h height of the canvas
   */
  public draw(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    // draw text
    ctx.font = `bold ${0.05 * h}px Bitter`;
    ctx.fillStyle = "#cccccc";
    ctx.textAlign = "center";
    ctx.fillText("Now loading...", w / 2, h / 2 - 0.1 * h);

    // show loading bar
    ctx.fillStyle = "#007acc";
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 0.008 * h;
    const barHeight = h * 0.05;
    const barLength = w * 0.75;
    const x = w / 2 - barLength / 2;
    const y = h / 2 - barHeight / 2;
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
      WM.enterWorld(new WorldDisplayTest());
    }
  }
}

import { World } from "./World";
import { RM } from "./ResourceManager";

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
    this.setType("World Loading");
    this.percentLoaded = 0;
  }

  /**
   * draws a loading bar centered on a gray canvas
   * @param canvas the canvas to draw on
   */
  public draw(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext("2d");

    // draw gray background
    ctx.fillStyle = "#aaaaaa";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw text
    ctx.font = "bold 50px Bitter";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Now loading...", canvas.width / 2, canvas.height / 2 - 100);

    // show loading bar
    ctx.fillStyle = "blue";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;
    const barHeight = 80;
    const barLength = canvas.width * 0.75;
    const x = canvas.width / 2 - barLength / 2;
    const y = canvas.height / 2 - barHeight / 2;
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
    }
  }
}

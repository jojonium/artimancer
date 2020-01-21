import { World } from "./World";
import { Vector } from "./Vector";

/**
 * This world is for testing display scaling
 */
export class WorldDisplayTest extends World {
  /** step count */
  private stepCount: number;

  /**
   * constructs a new WorldDisplayTest
   */
  public constructor() {
    super();
    this.setType("Display Test");
  }

  /**
   * draw a black box around the border of the drawing area, with a green fill,
   * and a blue circle with black outline in the center
   * @param ctx the canvas context to draw on
   * @param w width of the canvas
   * @param h height of the canvas
   */
  public draw(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.lineWidth = 0.008 * h;
    ctx.strokeStyle = "yellow";
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "blue";
    ctx.fillStyle = "red";
    ctx.beginPath();
    const z = 0.05 * w;
    ctx.rect(-z, -z, z * 2, z * 2);
    ctx.fill();
    ctx.stroke();

    const center = new Vector(w / 2, h / 2);
    ctx.fillStyle = "blue";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(center.x, center.y, z * 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.font = `bold ${0.04 * h}px monospace`;
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.fillText("" + this.stepCount, w * 0.95, h * 0.05);
  }

  /**
   * set stepcount
   * @param stepCount current step number
   */
  public step(stepCount: number): void {
    this.stepCount = stepCount;
  }
}

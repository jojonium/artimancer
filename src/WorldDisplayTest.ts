import { World } from "./World";
import { Vector } from "./Vector";
import { CANV_SIZE } from "./DisplayManager";

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
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.lineWidth = 0.008 * CANV_SIZE;
    ctx.strokeStyle = "yellow";
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.rect(0, 0, 1000, 1000);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "blue";
    ctx.fillStyle = "red";
    ctx.beginPath();
    const z = 0.05 * CANV_SIZE;
    ctx.rect(-z, -z, z * 2, z * 2);
    ctx.fill();
    ctx.stroke();

    const center = new Vector(CANV_SIZE / 2, CANV_SIZE / 2);
    ctx.fillStyle = "blue";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(center.x, center.y, z * 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.font = `bold ${0.04 * CANV_SIZE}px monospace`;
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.fillText("" + this.stepCount, CANV_SIZE * 0.95, CANV_SIZE * 0.05);
  }

  /**
   * set stepcount
   * @param stepCount current step number
   */
  public step(stepCount: number): void {
    this.stepCount = stepCount;
  }
}

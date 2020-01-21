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
   * @param canvas the canvas to draw on
   */
  public draw(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = 12;
    ctx.fillStyle = "green";
    ctx.strokeStyle = "black";
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "blue";
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.rect(-50, -50, 100, 100);
    ctx.fill();
    ctx.stroke();

    const center = new Vector(canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = "blue";
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.arc(center.x, center.y, 100, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.font = "bold 50px monospace";
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.fillText("" + this.stepCount, 950, 80);
  }

  /**
   * set stepcount
   * @param stepCount current step number
   */
  public step(stepCount: number): void {
    this.stepCount = stepCount;
  }
}

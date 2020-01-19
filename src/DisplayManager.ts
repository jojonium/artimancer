import { Manager } from "./Manager";

/**
 * The DisplayManager class handles drawing things to the screen
 */
class DisplayManager extends Manager {
  /** singleton instance */
  private static _instance = new DisplayManager();
  /** HTML canvas that will be drawn on */
  private canvas: HTMLCanvasElement;
  /** canvas context to draw on */
  private ctx: CanvasRenderingContext2D;

  private constructor() {
    super();
    this.setType("Display Manager");
  }

  public static getInstance(): DisplayManager {
    return DisplayManager._instance;
  }

  /**
   * Creates the canvas and initializes draw buffers
   * @override
   */
  public startUp(): void {
    const canvasHolder = document.getElementById("canvas-holder");
    // remove any existing canvas
    while (canvasHolder.firstChild) {
      canvasHolder.removeChild(canvasHolder.firstChild);
    }
    // create new canvas
    this.canvas = document.createElement("canvas");
    this.canvas.id = "canvas";
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.width = window.screen.width / 2;
    this.canvas.height = window.screen.height / 2;
    canvasHolder.appendChild(this.canvas);

    console.log("Display Manager successfully started");
  }
}

export const DM = DisplayManager.getInstance();

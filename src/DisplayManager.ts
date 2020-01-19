import { Manager } from "./Manager";

/**
 * The DisplayManager class handles drawing things to the screen
 */
class DisplayManager extends Manager {
  /** singleton instance */
  private static _instance = new DisplayManager();
  /** HTML canvas that will be displayed to the user */
  private canvas: HTMLCanvasElement;
  /** HTML canvas that we draw on */
  private backCanvas: HTMLCanvasElement;
  /** canvas context that will be displayed to the user */
  private context: CanvasRenderingContext2D;
  /** canvas context that we draw on */
  private backContext: CanvasRenderingContext2D;

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
    this.context = this.canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;
    this.canvas.width = window.screen.width / 2;
    this.canvas.height = window.screen.height / 2;
    canvasHolder.appendChild(this.canvas);

    // Create back canvas that is the size of the actual screen. We'll draw
    // everything on this and then scale and swap it to the front canvas
    this.backCanvas = document.createElement("canvas");
    this.backContext = this.backCanvas.getContext("2d");
    this.backContext.imageSmoothingEnabled = false;
    this.backCanvas.width = window.screen.width;
    this.backCanvas.width = window.screen.height;

    // start drawing the canvas
    window.requestAnimationFrame(this.draw.bind(this));

    console.log("Display Manager successfully started");
  }

  /**
   * Draw one frame onto the canvas, then request an animation from to do it
   * again. draw() only needs to be called once
   */
  private draw(): void {
    // TODO implement a GameMode class that can have its own draw method
    this.backContext.save();
    this.backContext.fillStyle = "green";
    this.backContext.fillRect(
      0,
      0,
      this.backCanvas.width,
      this.backCanvas.height
    );
    this.backContext.restore();

    // swap the back canvas to the front
    this.context.save();
    this.context.scale(
      this.canvas.width / this.backCanvas.width,
      this.canvas.height / this.backCanvas.height
    );
    this.context.drawImage(this.backCanvas, 0, 0);
    this.context.restore();

    // now do it again
    window.requestAnimationFrame(this.draw.bind(this));
  }

  /**
   * attempt to enter fullscreen
   */
  public enterFullscreen(): void {
    // check if the browser supports requestFullscreen()
    if (this.canvas.requestFullscreen) {
      this.canvas.requestFullscreen().then(() => {
        this.canvas.width = window.screen.width;
        this.canvas.height = window.screen.height;
      });
    }
  }

  /**
   * this should be called when fullscreen is exited. Restores the canvas size
   */
  public onExitFullscreen(): void {
    if (document.fullscreenElement === null) {
      this.canvas.width = window.screen.width / 2;
      this.canvas.height = window.screen.height / 2;
    }
  }
}
export const DM = DisplayManager.getInstance();

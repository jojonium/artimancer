import { Manager } from "./Manager";
import { WM } from "./WorldManager";

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
  /** whether to log extra info */
  private noisy = true;
  /** width/height of back canvas in pixels */
  private backDimension = 1000;

  private constructor() {
    super();
    this.setType("Display Manager");
  }

  /**
   * return the singleton instance of this manager
   */
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
    this.backCanvas.width = this.backDimension;
    this.backCanvas.height = this.backDimension;

    // set event listeners
    document.removeEventListener(
      "fullscreenchange",
      this.adjustCanvasSize.bind(this)
    );
    document.addEventListener(
      "fullscreenchange",
      this.adjustCanvasSize.bind(this)
    );
    window.removeEventListener("resize", this.adjustCanvasSize.bind(this));
    window.addEventListener("resize", this.adjustCanvasSize.bind(this));

    // start drawing the canvas
    window.requestAnimationFrame(this.draw.bind(this));

    super.startUp();
    if (this.noisy) console.log("Display Manager successfully started");
  }

  /**
   * Draw one frame onto the canvas, then request an animation from to do it
   * again. draw() only needs to be called once
   */
  private draw(): void {
    // The back canvas can be any size, depending on the user's screen size. We
    // want the drawn canvas to scale well to bigger screen sizes. Basically all
    // draw functions should assume they're drawing on a 1000x1000 pixel canvas,
    // and we'll we'll abstract the scaling away

    this.backContext.save();
    // draw black background
    this.backContext.fillStyle = "black";
    this.backContext.fillRect(
      0,
      0,
      this.backCanvas.width,
      this.backCanvas.height
    );
    // draw the current world
    WM.draw(this.backCanvas);
    this.backContext.restore();

    // swap the back canvas to the front
    this.context.save();
    // draw canvas background
    this.context.fillStyle = "#d2d2d2";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    let scaleFactor = 1;
    let yTranslate = 0;
    let xTranslate = 0;
    if (this.canvas.width < this.canvas.height) {
      // width is the limiting factor
      scaleFactor = this.canvas.width / this.backDimension;
      yTranslate = (this.canvas.height - this.canvas.width) / (2 * scaleFactor);
    } else {
      // height is the limiting factor
      scaleFactor = this.canvas.height / this.backDimension;
      xTranslate = (this.canvas.width - this.canvas.height) / (2 * scaleFactor);
    }
    this.context.scale(scaleFactor, scaleFactor);
    this.context.translate(xTranslate, yTranslate);
    this.context.drawImage(this.backCanvas, 0, 0);
    this.context.restore();

    // now do it again
    window.requestAnimationFrame(this.draw.bind(this));
  }

  public toggleFullScreen(): void {
    if (document.fullscreenElement === null) {
      // enter fullscreen
      // check if the browser supports requestFullscreen()
      if (this.canvas.requestFullscreen) {
        this.canvas.requestFullscreen().then(() => {
          this.canvas.width = window.screen.width;
          this.canvas.height = window.screen.height;
        });
      }
    } else {
      document.exitFullscreen();
      this.adjustCanvasSize();
    }
  }

  /**
   * this should be called whenever the window size changes, to make sure the
   * canvas keeps up with it
   */
  public adjustCanvasSize(): void {
    if (document.fullscreenElement === null) {
      // non-fullscreen mode
      this.canvas.width = window.screen.width / 2;
      this.canvas.height = window.screen.height / 2;
    } else {
      // in fullscreen mode, fill the whole screen
      this.canvas.width = window.screen.width;
      this.canvas.height = window.screen.height;
    }
  }
}
export const DM = DisplayManager.getInstance();

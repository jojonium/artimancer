import { Manager } from "./Manager";
import { WM } from "./WorldManager";

export const CANV_SIZE = 1000;

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
  /** dimensions of back canvas in pixels */
  private quality = 500;

  /**
   * private because DisplayManager is singleton
   */
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
    canvasHolder.appendChild(this.canvas);

    // Create back canvas that is the size of the actual screen. We'll draw
    // everything on this and then scale and swap it to the front canvas
    this.backCanvas = document.createElement("canvas");
    this.backContext = this.backCanvas.getContext("2d");
    this.backContext.imageSmoothingEnabled = false;

    this.adjustCanvasSize();

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
    if (this.noisy) console.log("DM: successfully started");
  }

  /**
   * Draw one frame onto the canvas, then request an animation from to do it
   * again. draw() only needs to be called once.
   *
   * We abstract away all the scaling to this.quality and screen size, so all
   * other draw functions should assume they are drawing on a CANV_SIZE by
   * CANV_SIZE square canvas
   */
  private draw(): void {
    // clear backContext
    this.backContext.clearRect(
      0,
      0,
      this.backCanvas.width,
      this.backCanvas.height
    );

    this.backContext.save();
    // scale the back canvas so it's as if we're drawing on a square with width
    // and height equal to CANV_SIZE
    let scaleFact = 1;
    let yTranslate = 0;
    let xTranslate = 0;
    if (this.backCanvas.width < this.backCanvas.height) {
      // width is the limiting factor
      scaleFact = this.backCanvas.width / this.quality;
      yTranslate =
        (this.backCanvas.height - this.backCanvas.width) / (2 * scaleFact);
    } else {
      // height is the limiting factor
      scaleFact = this.backCanvas.height / this.quality;
      xTranslate =
        (this.backCanvas.width - this.backCanvas.height) / (2 * scaleFact);
    }
    // scale to size of this.quality
    this.backContext.scale(scaleFact, scaleFact);
    this.backContext.translate(xTranslate, yTranslate);
    // now scale to the constant CANV_SIZE
    this.backContext.scale(this.quality / CANV_SIZE, this.quality / CANV_SIZE);
    // draw the current world
    WM.draw(this.backContext);
    this.backContext.restore();

    // swap the back canvas to the front
    this.context.save();
    // draw canvas background
    this.context.fillStyle = "#232629";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // draw backContext on the front
    this.context.scale(
      this.canvas.width / this.backCanvas.width,
      this.canvas.height / this.backCanvas.height
    );
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
    // scale back-canvas to the size of this.quality
    if (window.screen.width < window.screen.height) {
      // width is the limiting factor
      this.backCanvas.width = this.quality;
      this.backCanvas.height =
        (this.quality * window.screen.height) / window.screen.width;
    } else {
      // height is the limiting factor
      this.backCanvas.height = this.quality;
      this.backCanvas.width =
        (this.quality * window.screen.width) / window.screen.height;
    }

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

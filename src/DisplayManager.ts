/**
 * Copyright (C) 2020 Joseph Petitti
 *
 * This file is part of Artimancer, a simple turn-based RPG for the web.
 *
 * Artimancer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * Artimancer is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * Artimancer. If not, see <https://www.gnu.org/licenses/>.
 */

import { Manager } from "./Manager";
import { WM } from "./WorldManager";
import { UM } from "./UIManager";
import { Vector } from "./Vector";
import { UIElement } from "./UIElement";

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
  private quality = 1000;

  /**
   * private because DisplayManager is singleton
   */
  private constructor() {
    super();
    this.setType("Display Manager");

    // set these temporarily until we startUp
    this.canvas = document.createElement("canvas");
    this.backCanvas = document.createElement("canvas");
    let tempCtx = this.canvas.getContext("2d");
    if (tempCtx === null)
      throw new Error("DM: can't get 2d context from fake canvas");
    this.context = tempCtx;
    tempCtx = this.backCanvas.getContext("2d");
    if (tempCtx === null)
      throw new Error("DM: can't get 2d context from fake back canvas");
    this.backContext = tempCtx;
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
    if (canvasHolder === null || canvasHolder === undefined)
      throw new Error("DM: no canvas-holder element");

    // remove any existing canvas
    while (canvasHolder.firstChild) {
      canvasHolder.removeChild(canvasHolder.firstChild);
    }

    // create new canvas
    this.canvas = document.createElement("canvas");
    this.canvas.id = "canvas";
    let tempCtx = this.canvas.getContext("2d");
    if (tempCtx === null)
      throw new Error("DM: can't get 2d context from canvas");
    this.context = tempCtx;
    this.context.imageSmoothingEnabled = false;
    canvasHolder.appendChild(this.canvas);

    // Create back canvas that is the size of the actual screen. We'll draw
    // everything on this and then scale and swap it to the front canvas
    this.backCanvas = document.createElement("canvas");
    tempCtx = this.backCanvas.getContext("2d");
    if (tempCtx === null)
      throw new Error("DM: can't get 2d context from back-canvas");
    this.backContext = tempCtx;
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

    // draw UI on top of world
    UM.draw(this.backContext, this.backCanvas.width, this.backCanvas.height);

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

  /**
   * toggle fullscreen status of the front canvas and adjust its size
   * accordingly
   */
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

  /**
   * translates an input vector that is a set of window coordinates to the
   * appropriate coordinates in the world
   * @param vec input Vector, representing a location on the window
   * @return a corresponding coordinate Vector in the game world
   */
  public windowToWorldCoord(vec: Vector): Vector {
    let scaleFact = 1;
    let xTranslate = 0;
    let yTranslate = 0;
    let scaleTo: HTMLCanvasElement | Screen = window.screen;
    if (document.fullscreenElement === null) {
      scaleTo = this.canvas;
      // translate based on canvas's position in document
      const rect = this.canvas.getBoundingClientRect();
      vec = vec.subtract(rect.left, rect.top);
    }
    if (window.screen.width < window.screen.height) {
      // width is the limiting factor
      scaleFact = CANV_SIZE / scaleTo.width;
      yTranslate = -(scaleTo.height - scaleTo.width) / 2;
    } else {
      // height is the limiting factor
      scaleFact = CANV_SIZE / scaleTo.height;
      xTranslate = -(scaleTo.width - scaleTo.height) / 2;
    }
    vec = vec.add(xTranslate, yTranslate);
    vec = vec.scale(scaleFact);

    return vec;
  }
}

export const DM = DisplayManager.getInstance();

/**
 * Draws a rounded rect on the canvas. You'll still have to call ctx.stroke()
 * and/or ctx.fill() afterward
 * @param ctx cavnas context to draw on
 * @param topLeft Vector pointing to the top left of the rectangle
 * @param w width of the rectangle
 * @param h height of the rectangle
 * @param cornerRadius radius of corners
 */
export const roundedRect = (
  ctx: CanvasRenderingContext2D,
  topLeft: Vector,
  w: number,
  h: number,
  cornerRadius: number
): void => {
  const x1 = topLeft.x;
  const y1 = topLeft.y;
  const x2 = topLeft.x + w;
  const y2 = topLeft.y + h;

  // the JavaScript canvas API doesn't have a built-in function for drawing
  // rounded rectangles, so we trace out the path manually
  ctx.beginPath();
  ctx.moveTo(x1 + cornerRadius, y1);
  ctx.lineTo(x2 - cornerRadius, y1);
  ctx.quadraticCurveTo(x2, y1, x2, y1 + cornerRadius);
  ctx.lineTo(x2, y2 - cornerRadius);
  ctx.quadraticCurveTo(x2, y2, x2 - cornerRadius, y2);
  ctx.lineTo(x1 + cornerRadius, y2);
  ctx.quadraticCurveTo(x1, y2, x1, y2 - cornerRadius);
  ctx.lineTo(x1, y1 + cornerRadius);
  ctx.quadraticCurveTo(x1, y1, x1 + cornerRadius, y1);
  ctx.closePath();
};

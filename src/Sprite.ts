import { Frame } from "./Frame";
import { Clock } from "./Clock";

/**
 * This class represents a sprite, which can be single frame or multiple
 */
export class Sprite {
  /** amount of time between frames, in milliseconds */
  private slowdown: number;
  /** frames of this sprite */
  private frames: Frame[];
  /** clock for timing frames */
  private clock: Clock;
  /** current frame index to draw */
  private currentFrameNum: number;

  /**
   * constructs a new sprite
   * @param slowdown time between frames, in milliseconds. Set to zero for
   * non-animating sprites
   * @param length number of frames in this sprite
   */
  public constructor(slowdown = 16, length = 1) {
    this.slowdown = slowdown;
    this.frames = new Array<Frame>(length);
    if (this.frames.length > 1 || slowdown > 1) {
      this.clock = new Clock();
    }
    this.currentFrameNum = 0;
  }

  /**
   * adds a frame to this sprite at a particular index
   * @param index the zero-based index of the frame
   * @param frame the frame to add
   */
  public setFrame(index: number, frame: Frame): void {
    this.frames[index] = frame;
  }

  /**
   * Should be called very frequently (every draw step even). Returns the
   * current frame that should be drawn.
   *
   * If slowdown is less than the time between getCurrentFrame() calls weird
   * stuff will happen
   */
  public getCurrentFrame(): Frame {
    if (this.frames.length <= 1 || this.slowdown < 1) {
      // non-animating sprite
      return this.frames[0];
    }
    const timeElapsed = this.clock.split();
    if (timeElapsed >= this.slowdown) {
      // time to move up to the next frame
      this.clock.delta();
      this.currentFrameNum = (this.currentFrameNum + 1) % this.frames.length;
    }
    return this.frames[this.currentFrameNum];
  }
}

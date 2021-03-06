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

import { Clock } from "./Clock";

/**
 * One frame of a sprite, consisting of an SVG image
 */
export class Frame {
  /** Image for this frame */
  private readonly img: HTMLImageElement;

  public constructor(img: HTMLImageElement) {
    this.img = img;
  }

  public getImage(): HTMLImageElement {
    return this.img;
  }
}

/**
 * This class represents a sprite, which can be single frame or multiple
 */
export class Sprite {
  /** amount of time between frames, in milliseconds */
  private readonly slowdown: number;
  /** frames of this sprite */
  private readonly frames: Frame[];
  /** clock for timing frames */
  private readonly clock: Clock | undefined;
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
    if (
      this.clock === undefined ||
      this.frames.length <= 1 ||
      this.slowdown < 1
    ) {
      // non-animating sprite
      return this.frames[0];
    } else {
      const timeElapsed = this.clock.split();
      if (timeElapsed >= this.slowdown) {
        // time to move up to the next frame
        this.clock.delta();
        this.currentFrameNum = (this.currentFrameNum + 1) % this.frames.length;
      }
      return this.frames[this.currentFrameNum];
    }
  }
}

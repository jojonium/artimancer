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

import { Clock } from "../Clock";
import { TextUIElement } from "./TextUIElement";
import { Box } from "../Box";
import { Vector } from "../Vector";

export class FPSCounter extends TextUIElement {
  private clock: Clock;
  private frameCounter = 0;
  private stepCounter = 0;
  private fps = 0;
  private sps = 0;

  public constructor() {
    super("fps-counter", new Box(new Vector(0, 0), 300, 50), "No FPS yet");
    this.style.padding = 5;
    this.clock = new Clock();
    this.clock.delta();
  }

  /** overrided to count frames */
  public draw(ctx: CanvasRenderingContext2D): void {
    this.frameCounter++;
    if (this.clock.split() >= 1000) {
      this.clock.delta();
      this.fps = this.frameCounter;
      this.sps = this.stepCounter;
      this.setText(`${this.fps} FPS, ${this.sps} SPS`);
      this.frameCounter = 0;
      this.stepCounter = 0;
    }
    super.draw(ctx);
  }

  public step(): void {
    this.stepCounter++;
  }
}
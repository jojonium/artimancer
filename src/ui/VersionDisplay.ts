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

import { Box } from "../Box";
import { UIElement } from "../UIElement";
import { Vector } from "../Vector";

export class VersionDisplay extends UIElement {
  private versionText: string;

  /**
   * @param version like '1.2.3'
   */
  public constructor(version: string) {
    super("version-display", new Box(new Vector(0, 0), 200, 50));
    this.versionText = "Artimancer v" + version;
  }

  /** shows text with version number */
  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.font = "bold 20px Bitter";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#d2d2d2";
    ctx.fillText(this.versionText, 5, 25);
  }
}

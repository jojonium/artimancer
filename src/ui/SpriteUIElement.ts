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
import { Sprite } from "../Sprite";
import { UIElement } from "../UIElement";

/** a UI element that just displays a sprite */
export class SpriteUIElement extends UIElement {
  private sprite: Sprite | undefined;

  public constructor(label: string, box: Box, sprite?: Sprite) {
    super(label, box);
    if (sprite !== undefined) this.sprite = sprite;
  }

  public setSprite(newSprite: Sprite | undefined): void {
    this.sprite = newSprite;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.sprite === undefined) return;
    ctx.drawImage(
      this.sprite.getCurrentFrame().getImage(),
      this.box.topLeft.x,
      this.box.topLeft.y,
      this.box.width,
      this.box.height
    );
  }
}

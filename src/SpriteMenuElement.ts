/**
 * Copyright (C) 2020 Joseph Petitti
 *
 * This file is part of Artimancer, a simple turn-based RPG for the web.
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

import { MenuElement } from "./Menu";
import { Sprite } from "./Sprite";
import { Box } from "./Box";
import { RM } from "./ResourceManager";

/**
 * A simple menu element that displays a sprite
 */
export class SpriteMenuElement extends MenuElement {
  /** the sprite of this menu element */
  private sprite: Sprite;

  /**
   * constructs a menu element that displays a sprite
   * @param box the bounding box of this element in its parent menu
   * @param spriteID the string label of the sprite to use
   */
  public constructor(box: Box, spriteID: string) {
    super(box);
    const sprite = RM.getSprite(spriteID);
    if (sprite === undefined)
      throw new Error(`SpriteMenuElement: couldn't get sprite ${spriteID}`);
    this.sprite = sprite;
  }

  /**
   * draw the sprite in this element's bounding box
   * @param ctx the canvas context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(
      this.sprite.getCurrentFrame().getImage(),
      this.box.topLeft.x,
      this.box.topLeft.y,
      this.box.width,
      this.box.height
    );
  }
}

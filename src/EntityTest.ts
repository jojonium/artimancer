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

import { FreeRoamEntity } from "./FreeRoamEntity";
import { Sprite } from "./Sprite";
import { Vector } from "./Vector";

/**
 * This class is a free roam entity used only for testing
 */
export class EntityTest extends FreeRoamEntity {
  /**
   * @param label string identifier for this entity
   * @param pos center location of this entity
   * @param width
   * @param height
   * @param sprite sprite for this entity
   */
  public constructor(
    label: string,
    pos: Vector,
    width: number,
    height: number,
    sprite: Sprite
  ) {
    super(label, pos);
    this.height = height;
    this.width = width;
    this.setSprite(sprite);
  }
}

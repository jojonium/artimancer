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

import { Vector } from "./Vector";
import { Sprite } from "./Sprite";
import { Box } from "./Box";

/**
 * This class represents an entity, such as a player character, NPC, or enemy,
 * in the free roam world
 */
export abstract class FreeRoamEntity {
  /** string identifier for this entity */
  private readonly label: string;
  /** direction the entity is facing */
  private dir: Vector;
  /** optional sprite for this entity to display */
  private sprite: Sprite | undefined;
  /** location and dimensions for where to draw this entity */
  public drawBox: Box;
  /** higher altitudes get drawn on top of lower ones */
  public altitude: number;

  /**
   * Constructs a new FreeRoamEntity
   * @param label string identifier for this entity
   */
  protected constructor(label: string) {
    this.label = label;
    // start facing right
    this.dir = new Vector(1, 0);
    this.drawBox = new Box(new Vector(0, 0), 0, 0);
    this.sprite = undefined;
    this.altitude = 0;
  }

  /**
   * get unique string identifier
   */
  public getLabel(): string {
    return this.label;
  }

  /**
   * @param sprite new sprite for this entity
   */
  public setSprite(sprite: Sprite): void {
    this.sprite = sprite;
  }

  /**
   * Get this entity's sprite, if it exists
   */
  public getSprite(): Sprite | undefined {
    return this.sprite;
  }

  /**
   * Draws this entity. By default this just draws the sprite, but it can be
   * overridden to provide other behaviour
   * @param ctx the canvas context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.sprite !== undefined) {
      ctx.drawImage(
        this.sprite.getCurrentFrame().getImage(),
        this.drawBox.topLeft.x,
        this.drawBox.topLeft.y,
        this.drawBox.width,
        this.drawBox.height
      );
    }
  }
}

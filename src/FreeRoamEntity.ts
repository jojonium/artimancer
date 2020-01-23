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

/**
 * This class represents an entity, such as a player character, NPC, or enemy,
 * in the free roam world
 */
export abstract class FreeRoamEntity {
  /** string identifier for this entity */
  private label: string;
  /** center position of this entity */
  public pos: Vector;
  /** direction the entity is facing */
  private dir: Vector;
  /** width of this entity in pixels on a CANV_SIZE by CANV_SIZE canvas */
  public width: number;
  /** height of this entity in pixels on a CANV_SIZE by CANV_SIZE canvas */
  public height: number;

  /**
   * Constructs a new FreeRoamEntity
   * @param label string identifier for this entity
   * @param pos center position of this entity
   */
  public constructor(label: string, pos: Vector) {
    this.label = label;
    this.pos = pos;
    // start facing right
    this.dir = new Vector(1, 0);
    this.width = 0;
    this.height = 0;
  }

  /**
   * Draws this entity
   * @param ctx the canvas context to draw on
   */
  public abstract draw(ctx: CanvasRenderingContext2D): void;
}

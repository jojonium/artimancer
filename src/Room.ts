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

import { Sprite } from "./Sprite";
import { Vector } from "./Vector";
import { FreeRoamEntity } from "./FreeRoamEntity";
import { Box } from "./Box";

export class Background {
  public constructor(
    /** sprite for this bgObject */
    public sprite: Sprite,
    /** dimensions to draw the sprite in */
    public box: Box,
    /** higher altitudes are drawn on top of lower altitudes */
    public altitude: number
  ) {}

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

/**
 * The Room class represents a single area of the free-roam world, and includes
 * a background, NPCs, enemies, and other objects
 */
export class Room {
  /** unique identifier for this room */
  private label: string;
  /**
   * elements that make up the visual background of this room, sorted in order
   * of nondecreasing altitude
   */
  private backgrounds: Background[];
  /** all free roam entities in this room */
  private entities: FreeRoamEntity[];
  /** array of all things to draw */
  private drawables: (Background | FreeRoamEntity)[];
  /** whether or not the drawables array has been sorted yet  */
  private sorted = false;

  /**
   * Constructs a new room
   * @param label a string identifier for this room
   */
  public constructor(label: string) {
    this.label = label;
    this.backgrounds = [];
    this.entities = [];
    this.drawables = [];
  }

  /**
   * @return this Room's unique string identifier
   */
  public getLabel(): string {
    return this.label;
  }

  /**
   * Adds a piece of the background for this room
   * @param sprite the sprite of this background piece
   * @param altitude higher layers are drawn on top of lower ones
   */
  public addBackground(
    sprite: Sprite,
    centerPos: Vector,
    width: number,
    height: number,
    altitude = 0
  ): void {
    this.backgrounds.push(
      new Background(
        sprite,
        new Box(centerPos.subtract(width / 2, height / 2), width, height),
        altitude
      )
    );
    this.sorted = false;
  }

  /**
   * Adds any number of entities to this room
   * @param ent the entities to add
   */
  public addEntities(...ent: FreeRoamEntity[]): void {
    this.entities.push(...ent);
    this.sorted = false;
  }

  /**
   * draw this room to the canvas
   * @param ctx the canvas context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    // sort array of drawables in non-decreasing order
    if (!this.sorted) {
      // TODO consider the efficiency of this
      this.drawables = new Array<Background | FreeRoamEntity>()
        .concat(this.backgrounds, this.entities)
        .sort((a, b) => {
          const diff = a.altitude - b.altitude;
          if (
            diff === 0 &&
            a instanceof Background &&
            b instanceof FreeRoamEntity
          ) {
            // backgrounds always come before entities of the same altitude
            console.log("here");
            return -1;
          }
          return diff;
        });
      this.sorted = true;
    }
    // draw all backgrounds and entities in ascending altitude layer
    this.drawables.map(drawable => {
      drawable.draw(ctx);
    });
  }

  /**
   * get objects representing this room's background sprites, sorted by layer
   */
  public getBackgrounds(): Background[] {
    return this.backgrounds;
  }

  /**
   * get all the free roam entities in this room
   */
  public getEntities(): FreeRoamEntity[] {
    return this.entities;
  }
}

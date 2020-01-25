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

import { World } from "./World";
import { Room } from "./Room";
import { Vector } from "./Vector";

/**
 * This is a world in which the player character can walk around, talk to NPCs,
 * and encounter enemies
 */
export class WorldFreeRoam extends World {
  protected currentRoom: Room | undefined;
  /** camera offset from the canvas origin */
  public cameraOffset: Vector;

  /**
   * Creates a new WorldFreeRoam
   */
  public constructor() {
    super();
    this.setType("Free Roam");
    this.cameraOffset = new Vector(0, 0);
  }

  /**
   * draws this world
   * @param ctx the canvas context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    // translate based on camera offset
    ctx.translate(this.cameraOffset.x, this.cameraOffset.y);
    if (this.currentRoom !== null && this.currentRoom !== undefined) {
      this.currentRoom.draw(ctx);
    }
    // translate back
    ctx.translate(-this.cameraOffset.x, -this.cameraOffset.y);
  }

  /**
   * actions to take each game step
   */
  public step(): void {
    // TODO implement
  }

  /**
   * Sets a new room as the active room
   * @param newRoom the new room the player is in
   */
  public setRoom(newRoom: Room): void {
    this.currentRoom = newRoom;
  }
}

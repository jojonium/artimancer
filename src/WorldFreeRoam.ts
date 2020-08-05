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
import { FreeRoamEntity } from "./FreeRoamEntity";
import { CANV_SIZE } from "./DisplayManager";

/**
 * This is a world in which the player character can walk around, talk to NPCs,
 * and encounter enemies
 */
export class WorldFreeRoam extends World {
  protected currentRoom: Room | undefined;
  /** camera offset from the canvas origin */
  public cameraOffset: Vector;
  /** entity that the camera will follow */
  protected cameraEntity: FreeRoamEntity | undefined;
  /**
   * radius of a circle in the center of the screen in which the cameraEntity
   * can move freely. If it moves outside this circle the camera will begin
   * moving. Set to 0 for the camera to always follow the cameraEntity
   */
  public cameraDeadZone: number;

  /**
   * Creates a new WorldFreeRoam
   */
  public constructor() {
    super();
    this.setType("Free Roam");
    this.cameraOffset = new Vector(0, 0);
    this.cameraEntity = undefined;
    this.cameraDeadZone = 0;
  }

  /**
   * draws this world
   * @param ctx the canvas context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    // set camera offset
    if (this.cameraEntity !== undefined) {
      // if the camera entity is bigger than the dead zone, camera should always
      // stick to it
      if (
        this.cameraDeadZone < this.cameraEntity.drawBox.width ||
        this.cameraDeadZone < this.cameraEntity.drawBox.height
      ) {
        this.cameraOffset = this.cameraEntity.drawBox
          .getCenter()
          .subtract(CANV_SIZE / 2, CANV_SIZE / 2);
      } else {
        const diff = this.cameraEntity.drawBox
          .getCenter()
          .subtract(this.cameraOffset.add(CANV_SIZE / 2));
        const distToAdjust = diff.getMagnitude() - this.cameraDeadZone;
        if (distToAdjust > 0) {
          // outside the dead zone
          this.cameraOffset = this.cameraOffset.add(
            diff.normalize().scale(distToAdjust)
          );
        }
      }
    }

    // translate based on camera offset
    ctx.translate(-this.cameraOffset.x, -this.cameraOffset.y);
    if (this.currentRoom !== null && this.currentRoom !== undefined) {
      this.currentRoom.draw(ctx);
    }
    // translate back
    ctx.translate(this.cameraOffset.x, this.cameraOffset.y);
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

  /**
   * @param newCameraEntity new entity for the camera to follow, or undefined
   * for a static camera
   */
  public setCameraEntity(newCameraEntity: FreeRoamEntity | undefined): void {
    this.cameraEntity = newCameraEntity;
  }

  /**
   * get the entity that the camera follows, if it exists
   */
  public getCameraEntity(): FreeRoamEntity | undefined {
    return this.cameraEntity;
  }
}

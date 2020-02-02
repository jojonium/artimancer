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
import { RM } from "./ResourceManager";
import { WM } from "./WorldManager";
import { CANV_SIZE } from "./DisplayManager";
import { Room } from "./Room";
import { Vector } from "./Vector";
import { EntityTest } from "./EntityTest";
import { WorldMainMenu } from "./WorldMainMenu";

/**
 * a World that displays a loading bar while resources are being loaded
 */
export class WorldLoading extends World {
  /** what percentage of loading is done so far */
  private percentLoaded: number;

  /**
   * creates this world
   */
  public constructor() {
    super();
    this.setType("Loading");
    this.percentLoaded = 0;
  }

  /**
   * draws a loading bar centered on a gray canvas
   * @param ctx the canvas context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    // draw text
    ctx.font = `bold 50px Bitter`;
    ctx.fillStyle = "#cccccc";
    ctx.textAlign = "center";
    ctx.fillText("Now loading...", CANV_SIZE / 2, CANV_SIZE / 2 - 100);

    // show loading bar
    ctx.fillStyle = "#007acc";
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 8;
    const barHeight = 50;
    const barLength = 750;
    const x = CANV_SIZE / 2 - barLength / 2;
    const y = CANV_SIZE / 2 - barHeight / 2;
    ctx.fillRect(x, y, barLength * this.percentLoaded, barHeight);
    ctx.rect(x, y, barLength, barHeight);
    ctx.stroke();
  }

  /**
   * Each step poll the resource manager for the percent loaded. If done
   * loading, tell the World Manager to move on to the next World
   */
  public step(): void {
    this.percentLoaded = RM.getPercentLoaded();
    if (1 - this.percentLoaded <= 0.01) {
      // TODO move on to next world
      const room = new Room("Test Room");
      const spr = RM.getSprite("test-bg");
      if (spr !== undefined) {
        room.addBackground(spr, new Vector(500, 300), 600, 200, 0);
      }
      const ballSpr = RM.getSprite("test");
      if (ballSpr !== undefined) {
        const e0 = new EntityTest(
          "Test Ball 0",
          new Vector(350, 700),
          100,
          100,
          ballSpr,
          0
        );
        const e1 = new EntityTest(
          "Test Ball 1",
          new Vector(450, 700),
          100,
          100,
          ballSpr,
          1
        );
        const e2 = new EntityTest(
          "Test Ball 2",
          new Vector(550, 700),
          100,
          100,
          ballSpr,
          2
        );
        room.addEntities(e0, e1, e2);
      }
      WM.enterWorld(new WorldMainMenu());
    }
  }
}

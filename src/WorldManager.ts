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

import { Manager } from "./Manager";
import { World } from "./World";
import { WorldLoading } from "./WorldLoading";
import { UM } from "./UIManager";

/**
 * The WorldManager manages the game world, including positions of entities and
 * GUI elements
 */
class WorldManager extends Manager {
  /** singleton instance */
  private static _instance = new WorldManager();
  /** current world the game is in */
  private currentWorld: World | undefined;
  /** whether to log extra info */
  private noisy = true;

  /**
   * private because WorldManager is supposed to be a singleton
   */
  private constructor() {
    super();
    this.setType("World Manager");
    this.currentWorld = undefined;
  }

  /**
   * Get the singleton instance of this manager
   */
  public static getInstance(): WorldManager {
    return WorldManager._instance;
  }

  /**
   * sets a new world as the active one and initializes it
   * @param world a new World to enter
   */
  public enterWorld(world: World): void {
    if (this.noisy) console.log(`WM: entering world ${world.getType()}`);
    if (this.currentWorld) this.currentWorld.exit();
    // clear any corner UI elements left over from the previous world
    UM.setCornerUI("top right", undefined);
    UM.setCornerUI("bottom right", undefined);
    UM.setCornerUI("bottom left", undefined);
    UM.setCornerUI("top left", undefined);
    this.currentWorld = world;
    this.currentWorld.enter();
  }

  /**
   * action to be performed every game step
   * @param stepCount number of current step
   */
  public step(stepCount: number): void {
    if (this.currentWorld !== undefined) {
      this.currentWorld.step(stepCount);
    }
  }

  /**
   * Draw the world on the canvas
   * @param ctx the canvas context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    if (this.currentWorld !== undefined) {
      this.currentWorld.draw(ctx);
    }
  }

  /**
   * starts up the World Manager, setting the initial World
   */
  public startUp(): void {
    // enter initial world
    this.enterWorld(new WorldLoading());

    super.startUp();
    if (this.noisy) console.log("WM: successfully started");
  }
}

export const WM = WorldManager.getInstance();

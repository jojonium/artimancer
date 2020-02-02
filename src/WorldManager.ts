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
import { Menu } from "./Menu";
import { IM } from "./InputManager";
import { DM } from "./DisplayManager";

/**
 * The WorldManager manages the game world, including positions of entities and
 * GUI elements
 */
class WorldManager extends Manager {
  /** singleton instance */
  private static _instance = new WorldManager();
  /** current world the game is in */
  private currentWorld: World | undefined;
  /**
   * currently displayed menus. Works like a stack, the last menu in the list
   * is on top and active
   */
  private menus: Menu[];
  /** whether to log extra info */
  private noisy = true;

  /**
   * private because WorldManager is supposed to be a singleton
   */
  private constructor() {
    super();
    this.setType("World Manager");
    this.currentWorld = undefined;
    this.menus = new Array<Menu>();
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
    DM.setCornerUI("top right", undefined);
    DM.setCornerUI("bottom right", undefined);
    DM.setCornerUI("bottom left", undefined);
    DM.setCornerUI("top left", undefined);
    this.currentWorld = world;
    this.currentWorld.enter();
  }

  /**
   * action to be performed every game step
   * @param stepCount number of current step
   */
  public step(stepCount: number): void {
    // close any menus that need to be closed
    const oldMenusLength = this.menus.length;
    const newMenus = new Array<Menu>();
    for (const m of this.menus) {
      if (m.keepAlive) newMenus.push(m);
    }
    if (oldMenusLength !== 0 && this.menus.length === 0) {
      // restore inputs to the regular world inputs
      IM.restore();
    }
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
    // draw menus on top of world
    this.menus.forEach(m => m.draw(ctx));
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

  /**
   * opens a menu, placing it on top of the stack of open menus, drawing it on
   * top, and focusing it
   */
  public openMenu(menu: Menu): void {
    // if this is the first menu, switch to menu controls
    if (this.menus.length === 0) {
      IM.save();
      IM.enterMenuMode();
    }
    this.menus.push(menu);
  }
}

export const WM = WorldManager.getInstance();

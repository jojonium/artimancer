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
import { DM } from "./DisplayManager";
import { UIElement } from "./UIElement";
import { WM } from "./WorldManager";
import { WorldRoomEditor } from "./WorldRoomEditor";
import { Room } from "./Room";

/**
 * This world controls the main menu of the game
 */
export class WorldMainMenu extends World {
  /**
   * constructs the main menu
   */
  public constructor() {
    super();
    this.setType("Main Menu");
  }

  /**
   * set up UI elements when this world is entered
   */
  public enter(): void {
    const version = require("../package.json").version;
    const versionDisplay = new UIElement("version-display");
    versionDisplay.setText("Artimancer v" + version);
    versionDisplay.setWidth(200);
    versionDisplay.setHeight(50);
    versionDisplay.style = {
      font: "bold 20px Bitter",
      fontFill: "#d2d2d2",
      lineHeight: 50,
      textAlign: "left",
      padding: 5
    };
    DM.setCornerUI("bottom right", versionDisplay);
  }

  public draw(ctx: CanvasRenderingContext2D): void {}

  public step(): void {}
}

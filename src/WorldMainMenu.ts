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

import { TextUIElement } from "./ui/TextUIElement";
import { UM } from "./UIManager";
import { World } from "./World";
import { Box } from "./Box";
import { Vector } from "./Vector";

/** game version */
const VERSION = "0.0.1";

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
    // create UI element to show version number
    const versionDisplay = new TextUIElement(
      "version-display",
      new Box(new Vector(0, 0), 200, 500),
      "Artimancer v" + VERSION
    );
    UM.setCornerUI("bottom right", versionDisplay);
  }

  public draw(): void {
    // TODO implement
    return;
  }

  public step(): void {
    return;
  }
}

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

const VERSION = "0.0.1";

import { World } from "./World";
import { DM, CANV_SIZE } from "./DisplayManager";
import { WM } from "./WorldManager";
import { UIElement } from "./UIElement";
import { Menu } from "./Menu";
import { Box } from "./Box";
import { Vector } from "./Vector";

class TitleMenu extends Menu {
  /**
   * set up the TitleMenu, covering the whole screen except for the margins
   */
  public constructor() {
    const margin = 20;
    super(
      new Box(
        new Vector(margin, margin),
        CANV_SIZE - margin * 2,
        CANV_SIZE - margin * 2
      )
    );

    const logoElement = new UIElement(
      "Logo",
      new Box(new Vector(250, 400), 500, 200)
    );
    logoElement.setSprite("logo");
    this.elements = [logoElement];
  }
}

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
    const versionDisplay = new UIElement(
      "version-display",
      new Box(new Vector(0, 0), 200, 50)
    );
    versionDisplay.setText("Artimancer v" + VERSION);
    versionDisplay.style = {
      font: "bold 20px Bitter",
      fontFill: "#d2d2d2",
      lineHeight: 50,
      textAlign: "left",
      padding: 5
    };
    DM.setCornerUI("bottom right", versionDisplay);

    WM.openMenu(new TitleMenu());
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    return;
  }

  public step(): void {
    return;
  }
}

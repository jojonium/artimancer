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

import { Menu, MENU_PADDING } from "./Menu";
import { Box } from "./Box";
import { Vector } from "./Vector";
import { UIElement } from "./UIElement";

/**
 * The Menu class represents a menu, containing a vertical list of items that
 * can be scrolled through, each of which has a function to execute when
 * selected
 */
export class MenuList extends Menu {
  /**
   * Creates a new MenuList
   * @param items pairs of text and functions to execute, each of which is
   * created as a MenulistItem
   * @param box position and dimensions of this menu in the global canvas
   */
  public constructor(
    box: Box,
    items = new Array<{ text: string; fn: () => any }>()
  ) {
    const menuItems = new Array<UIElement>(items.length);
    let verticalOffset = 0;
    const itemHeight = box.height / items.length - MENU_PADDING / 2;
    for (let i = 0; i < items.length; ++i) {
      menuItems[i] = new UIElement(
        "",
        new Box(
          new Vector(box.topLeft.x, box.topLeft.y + verticalOffset),
          box.width - MENU_PADDING * 2,
          itemHeight
        )
      );
      menuItems[i].setText(items[i].text);
      verticalOffset += itemHeight;
    }

    super(box, menuItems);
  }
}

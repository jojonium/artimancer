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

import { Menu, MenuElement } from "./Menu";
import { Vector } from "./Vector";

/**
 * Represents one line item on a menu
 */
export class MenuListItem extends MenuElement {
  /** text to display on this item */
  private text: string;

  /**
   * constructs a new menu item
   * @param pos the position of this element within its parent
   * @param text the string to display on this item
   */
  public constructor(pos: Vector, text: string) {
    super(pos);
    this.text = text;
  }
}

/**
 * The Menu class represents a menu, containing a vertical list of items that
 * can be scrolled through, each of which has a function to execute when
 * selected
 */
export class MenuList extends Menu {
  private items: MenuListItem[];

  /**
   * Creates a new MenuList, optionally initialized with a list of items
   * @param items the items to initialize this MenuList with
   */
  public constructor(items = new Array<MenuListItem>()) {
    super(items);
  }
}

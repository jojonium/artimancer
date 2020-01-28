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

import { Vector } from "./Vector";

/**
 * An element of a menu that can be selected
 */
export class MenuElement {
  /** position of this element in the menu */
  private pos: Vector;

  /**
   * @param pos the position of this element in its parent menu
   */
  public constructor(pos: Vector) {
    this.pos = pos;
  }

  /**
   * get position of this element in its parent menu
   */
  public getPos(): Vector {
    return this.pos;
  }
}

/**
 * An abstract class represeting menus, which are displayed on the screen and
 * contain a set of selectable and/or viewable elements
 */
export class Menu {
  /** all elements (e.g. bttons or text boxes) in this menu */
  private elements: MenuElement[];
  /** element that is currently selected */
  private SelectedElement: MenuElement | undefined;

  /**
   * Construct a new menu, optionally with a list of elements
   */
  public constructor(elements = new Array<MenuElement>()) {
    this.elements = elements;
    this.SelectedElement = this.elements[0] ?? undefined;
  }

  /**
   * change selection, (like when you press the arrow key in a particular
   * direction), selecting the next element in that direction
   * @param dir the direction to move in
   */
  public changeSelection(dir: "up" | "down" | "left" | "right") {
    if (this.SelectedElement === undefined) return;
    // TODO implement
  }
}

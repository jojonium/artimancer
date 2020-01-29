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

import { Menu, MenuElement, MENU_PADDING } from "./Menu";
import { Box } from "./Box";
import { Vector } from "./Vector";

/**
 * Represents one line item on a menu
 */
export class MenuListItem extends MenuElement {
  /** text to display on this item */
  private text: string;
  /** function to execute when this element is triggered */
  private fn: () => void;

  /**
   * constructs a new menu item
   * @param box the dimensions of this menu element in its parent
   * @param text the string to display on this item
   * @param fn the function to execute when this element is triggered
   */
  public constructor(box: Box, text: string, fn: () => void) {
    super(box);
    this.text = text;
    this.fn = fn;
    this.clickable = true;
  }

  /**
   * draws this element on the canvas
   * @param ctx the canvas context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.rect(
      this.box.topLeft.x,
      this.box.topLeft.y,
      this.box.width,
      this.box.height
    );
    ctx.fill();
    ctx.stroke();
    ctx.fillText(
      this.text,
      this.box.getCenter().x,
      this.box.getCenter().y,
      this.box.width
    );
  }

  /**
   * handles a click on this element
   */
  public click() {
    this.fn();
  }
}

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
    const menuItems = new Array<MenuListItem>(items.length);
    let verticalOffset = 0;
    const itemHeight = box.height / items.length - MENU_PADDING / 2;
    for (let i = 0; i < items.length; ++i) {
      menuItems[i] = new MenuListItem(
        new Box(
          new Vector(box.topLeft.x, box.topLeft.y + verticalOffset),
          box.width - MENU_PADDING * 2,
          itemHeight
        ),
        items[i].text,
        items[i].fn
      );
      verticalOffset += itemHeight;
    }

    super(box, menuItems);
  }
}

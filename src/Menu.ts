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
import { Box } from "./Box";

export const MENU_PADDING = 10;

/**
 * An element of a menu that can be selected
 */
export abstract class MenuElement {
  /** dimensions of this menu element in its parent */
  protected box: Box;
  /** whether this element can be clicked */
  protected clickable: boolean;

  /**
   * @param box the dimensions of this menu element in its parent
   */
  public constructor(box: Box) {
    this.box = box;
    this.clickable = false;
  }

  /**
   * draws this element on the canvas
   * @param ctx the canvas context to draw on
   */
  public abstract draw(ctx: CanvasRenderingContext2D): void;

  /**
   * get position of this element in its parent menu
   */
  public getPos(): Vector {
    return this.box.topLeft;
  }

  /**
   * @return width of this element
   */
  public getWidth(): number {
    return this.box.width;
  }

  /**
   * @return height of this element
   */
  public getHeight(): number {
    return this.box.height;
  }

  /**
   * @return whether or not this element is clickable
   */
  public isClickable(): boolean {
    return this.clickable;
  }
}

/**
 * An abstract class represeting menus, which are displayed on the screen and
 * contain a set of selectable and/or viewable elements
 */
export class Menu {
  /** all elements (e.g. bttons or text boxes) in this menu */
  protected elements: MenuElement[];
  /** element that is currently selected */
  private selectedElement: MenuElement | undefined;
  /** top-left location of this menu in the global canvas */
  private box: Box;
  /** style for background */
  fillStyle: string | CanvasPattern | CanvasGradient | undefined;
  /** style for outline */
  strokeStyle: string | CanvasPattern | CanvasGradient | undefined;
  /** whether this menu should be closed by the world manager next step */
  private shouldBeClosed: boolean;

  /**
   * Construct a new menu, optionally with a list of elements
   * @param box position and dimensions of this menu in the global canvas
   * @param elements menu elements to initialize with
   * @param fillStyle style for background fill
   * @param strokeStyle style for background outline
   */
  public constructor(
    box: Box,
    elements = new Array<MenuElement>(),
    fillStyle?: string | CanvasPattern | CanvasGradient,
    strokeStyle?: string | CanvasPattern | CanvasGradient
  ) {
    this.box = box;
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.elements = elements;
    this.selectedElement = this.elements[0] ?? undefined;
    this.shouldBeClosed = false;
  }

  /**
   * change selection, (like when you press the arrow key in a particular
   * direction), selecting the next element in that direction
   * @param dir the direction to move in
   */
  public changeSelection(dir: "up" | "down" | "left" | "right") {
    if (this.selectedElement === undefined) return;
    let elToSelect = this.selectedElement;
    let minDist = undefined;
    for (const el of this.elements) {
      const ydist = el.getPos().y - this.selectedElement.getPos().y;
      const xdist = el.getPos().x - this.selectedElement.getPos().x;
      if (dir === "up") {
        if (ydist < 0 && (minDist === undefined || ydist > minDist)) {
          minDist = ydist;
          elToSelect = el;
        }
      } else if (dir === "down") {
        if (ydist > 0 && (minDist === undefined || ydist < minDist)) {
          minDist = ydist;
          elToSelect = el;
        }
      } else if (dir === "left") {
        if (xdist < 0 && (minDist === undefined || xdist > minDist)) {
          minDist = xdist;
          elToSelect = el;
        }
      } else if (dir === "right") {
        if (xdist > 0 && (minDist === undefined || xdist < minDist)) {
          minDist = xdist;
          elToSelect = el;
        }
      }
    }
    this.selectedElement = elToSelect;
  }

  /**
   * draws this menu's background
   * @param ctx the canvas context to draw on
   */
  protected drawBackground(ctx: CanvasRenderingContext2D) {
    // draw background
    ctx.beginPath();
    ctx.rect(
      this.box.topLeft.x,
      this.box.topLeft.y,
      this.box.width,
      this.box.height
    );
    ctx.fillStyle = this.fillStyle ?? "rgba(0, 0, 0, 0)";
    ctx.strokeStyle = this.strokeStyle ?? "rgba(0, 0, 0, 0)";
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();
  }

  /**
   * draws this menu
   * by default this calls drawBackground(), then calls draw() for each child
   * element, but it can be overridden to proved different behavior
   * @param ctx the canvas context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D) {
    this.drawBackground(ctx);
    // draw all children
    ctx.save();
    ctx.translate(
      this.box.topLeft.x + MENU_PADDING,
      this.box.topLeft.y + MENU_PADDING
    );
    this.elements.forEach(el => el.draw(ctx));
    ctx.restore();
  }

  /**
   * @param shouldBeClosed whether this menu should be closed in the next step,
   * true by default
   */
  public closeMe(shouldBeClosed = true): void {
    this.shouldBeClosed = shouldBeClosed;
  }

  /**
   * true if this menu should stay open next step
   */
  public get keepAlive() {
    return !this.shouldBeClosed;
  }
}

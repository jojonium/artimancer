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

import { Box } from "./Box";
import { Vector } from "./Vector";

/**
 * This class represents a UI element, such as a text box or button prompt. UI
 * element are always drawn on top of the game world
 */
export abstract class UIElement {
  /** unique string identifier */
  protected label: string;
  /**
   * Bounding box of this element in its container. Usually relative to the
   * whole screen, but for corner UI elements it's relative to the corner
   */
  protected box: Box;
  /** what to do when clicked */
  protected onClick: () => void;

  /**
   * @param label a unique string identifier for this UI Element
   * @param box location and size of the element in its container
   */
  protected constructor(label: string, box: Box) {
    this.label = label;
    this.box = box;
    this.onClick = (): void => {
      return;
    };
  }

  /**
   * draws this UI element
   * @param ctx canvas context to draw on
   */
  public abstract draw(ctx: CanvasRenderingContext2D): void;

  /** what do do each game step (default nothing) */
  public step(): void {
    return;
  }

  /**
   * get unique string identifier
   */
  public getLabel(): string {
    return this.label;
  }

  /**
   * get top-left position of this element
   */
  public getPos(): Vector {
    return this.box.topLeft;
  }

  /**
   * @param newPos new top-left position of this element
   */
  public setPos(newPos: Vector): void {
    this.box.topLeft = newPos;
  }

  public getWidth(): number {
    return this.box.width;
  }

  /**
   * @param newWidth width of this element
   */
  public setWidth(newWidth: number): void {
    this.box.width = newWidth;
  }

  public getHeight(): number {
    return this.box.height;
  }

  /**
   * @param newHeight height of this element
   */
  public setHeight(newHeight: number): void {
    this.box.height = newHeight;
  }
}

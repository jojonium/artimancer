import { Vector } from "./Vector";

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

/**
 * This class represents a rectangle, which can be used for various abstract
 * mathematical operations
 */
export class Box {
  /** top left point of this box */
  public topLeft: Vector;
  /** width of this box */
  public width: number;
  /** height of this box */
  public height: number;

  /**
   * Constructs a new rectangle
   * @param topLeft top left coordinate of this box
   * @param width width of the box
   * @param height height of the box
   */
  public constructor(topLeft: Vector, width: number, height: number) {
    this.topLeft = topLeft;
    this.width = width;
    this.height = height;
  }

  /**
   * returns the center-point of this box
   */
  public getCenter(): Vector {
    return this.topLeft.add(this.width / 2, this.height / 2);
  }

  /**
   * test whether a point is inside this box
   * @param point the point to test
   */
  public contains(point: Vector): boolean {
    const p1 = this.topLeft;
    const p2 = this.topLeft.add(this.width, this.height);
    return (
      point.x >= p1.x && point.x <= p2.x && point.y >= p1.y && point.y <= p2.y
    );
  }

  /**
   * draws a rect with the dimensions of this box on the canvas
   * @param ctx the canvas context to draw on
   */
  public drawRect(ctx: CanvasRenderingContext2D): void {
    ctx.rect(this.topLeft.x, this.topLeft.y, this.width, this.height);
  }
}

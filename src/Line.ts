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

import { Vector } from "./Vector";

export class Line {
  /** starting point */
  public p1: Vector;
  /** ending point */
  public p2: Vector;

  /**
   * constructs a line
   * @param from starting point of this line
   * @param to ending point of this line
   */
  public constructor(from: Vector, to: Vector) {
    this.p1 = from;
    this.p2 = to;
  }

  /**
   * tests whether a point lies on this line
   * @param point the point to test
   */
  public intersects(point: Vector): boolean;

  /**
   * tests whether this line intersects another line
   * @param line the line to test
   */
  public intersects(line: Line): boolean;

  public intersects(arg1: Vector | Line): boolean {
    if (arg1 instanceof Vector) {
      return (
        arg1.x <= Math.max(this.p1.x, this.p2.x) &&
        arg1.x >= Math.min(this.p1.x, this.p2.x) &&
        arg1.y <= Math.max(this.p1.y, this.p2.y) &&
        arg1.y >= Math.min(this.p1.y, this.p2.y)
      );
    } else if (arg1 instanceof Line) {
      const o1 = Vector.orientation(this.p1, this.p2, arg1.p1);
      const o2 = Vector.orientation(this.p1, this.p2, arg1.p2);
      const o3 = Vector.orientation(arg1.p1, arg1.p2, this.p1);
      const o4 = Vector.orientation(arg1.p1, arg1.p2, this.p2);

      // General case
      if (o1 !== o2 && o3 !== o4) return true;

      // Special Cases
      if (o1 === 0 && this.intersects(arg1.p1)) return true;
      if (o2 === 0 && this.intersects(arg1.p2)) return true;
      if (o3 === 0 && arg1.intersects(this.p1)) return true;
      if (o4 == 0 && arg1.intersects(this.p2)) return true;

      // Doesn't fall in any of the above cases
      return false;
    }
    // should never get here
    return false;
  }
}

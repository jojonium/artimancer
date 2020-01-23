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
import { Line } from "./Line";
import { CANV_SIZE } from "./DisplayManager";

/**
 * This class represents a polygon of any number of points, represented by
 * Vectors.
 *
 * To create a Polygon, call new Polygon(), then addPoint() at least three
 * times, then closePath().
 */
export class Polygon {
  /** all the vertices of this polygon */
  private points: Vector[];

  /**
   * Creates a Polygon, optionally with a starting array of points.
   * @param points points of this polygon
   */
  public constructor(...points: Vector[]) {
    this.points = points;
  }

  /**
   * Adds points to this polygon
   * @param points any number of vectors representing the points to add
   * @return this, so it can be chained
   */
  public addPoints(...points: Vector[]): Polygon {
    this.points = this.points.concat(points);
    return this;
  }

  /**
   * return an array of the vertices in this polygon
   */
  public getPoints(): Vector[] {
    return this.points;
  }

  /**
   * Tests whether a point is inside the polygon by drawing a ray from the
   * point to infinity and counting the number of edges of the polygon it
   * intersects
   * @param vec the point to test
   */
  public contains(vec: Vector): boolean {
    if (this.points.length < 3) return false;
    // create a ray from vec to infinity
    const ray = new Line(vec, new Vector(CANV_SIZE * 100, vec.y));
    let count = 0;
    let i = 0;
    do {
      const next = (i + 1) % this.points.length;
      const line = new Line(this.points[i], this.points[next]);

      // check if the ray intersects the line from points[i] to points[next]
      if (line.intersects(ray)) {
        // if the point is on the line then it is obviously inside the polygon
        if (Vector.orientation(line.p1, vec, line.p2) === 0) {
          return line.intersects(vec);
        }
        count++;
      }
      i = next;
    } while (i != 0);

    // Return true if count is odd, false otherwise
    return count % 2 == 1;
  }
}

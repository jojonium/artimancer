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
}

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

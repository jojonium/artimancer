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
  /** whether this polygon is already complete */
  private isClosed: boolean;

  /**
   * Creates a Polygon, optionally with a starting array of points. Calls
   * closePath() automatically if points.length >= 3
   * @param points points of this polygon
   */
  public constructor(...points: Vector[]) {
    this.points = points;
    this.isClosed = false;
    if (this.points.length >= 3) this.closePath();
  }

  /**
   * Closes the polygon, creating a closed shape from the points.
   * @returns this if successful or if the polygon is already closed, returns
   * false if the polygon has fewer than three points (and therefore cannot be
   * closed)
   */
  public closePath(): Polygon | false {
    if (this.points.length < 3) return false;
    this.isClosed = true;
    return this;
  }

  /**
   * Adds points to this polygon and opens it
   * @param points any number of vectors representing the points to add
   * @return this, so it can be chained
   */
  public addPoints(...points: Vector[]): Polygon {
    this.points.concat(points);
    this.isClosed = false;
    return this;
  }

  /**
   * return an array of the vertices in this polygon
   */
  public getPoints(): Vector[] {
    return this.points;
  }
}

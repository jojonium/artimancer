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
 * This class represents a mathematical Vector. All methods that perform some
 * mathematical operation on a Vector return a new Vector only, they don't
 * modify the existing one
 */
export class Vector {
  /** x component */
  public x: number;
  /** y component */
  public y: number;

  /**
   * constructs an (x, y) vector
   * @param x x component
   * @param y y component
   */
  public constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * constructs a vector from polar coordinates
   * @param radius length of this vector
   * @param theta rotation in radians
   */
  public static fromPolar(radius = 0, theta = 0): Vector {
    return new Vector(radius * Math.cos(theta), radius * Math.sin(theta));
  }

  /**
   * @return the magnitude, or length, of this Vector
   */
  public getMagnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  /**
   * @return the rotation of this Vector, counter-clockwise from (1, 0) in
   * radians
   */
  public getAngle(): number {
    let theta = Math.atan(this.y / this.x);
    if (this.x < 0) theta += Math.PI;
    return theta;
  }

  /**
   * treating Vectors as points on a Cartesian plane, finds the distance
   * between two vectors
   * @param other the other Vector
   */
  public distanceTo(other: Vector): number {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
  }

  /**
   * multiplies this Vector's x and y by another Vector's x and y and returns
   * it as a new Vector
   * @param other the other Vector
   */
  public multiply(other: Vector): Vector;

  /**
   * multiplies this Vector's x and y by given factors
   * @param sx x scale factor
   * @param sy y scale factor. Equal to sx if omitted
   */
  public multiply(sx: number, sy?: number): Vector;

  public multiply(arg1: number | Vector, arg2?: number): Vector {
    const scaleX: number = (arg1 as Vector).x ?? (arg1 as number);
    const scaleY = (arg1 as Vector).y ?? arg2 ?? scaleX;
    return new Vector(this.x * scaleX, this.y * scaleY);
  }

  /**
   * Scales the vector (multiplying it by the given factors)
   * @param sx x scale factor
   * @param sy y scale factor. Equal to sx if omitted
   */
  public scale(sx: number, sy = sx): Vector {
    return this.multiply(sx, sy);
  }

  /**
   * adds this Vector's x and y to another Vector's x and y and returns it as a
   * new Vector
   * @param other the other Vector
   */
  public add(other: Vector): Vector;

  /**
   * adds the given addends to this Vector's x and y
   * @param ax x addend
   * @param ay y addend. Equal to sx if omitted
   */
  public add(ax: number, ay?: number): Vector;

  public add(arg1: number | Vector, arg2?: number): Vector {
    const addendX: number = (arg1 as Vector).x ?? (arg1 as number);
    const addendY = (arg1 as Vector).y ?? arg2 ?? addendX;
    return new Vector(this.x + addendX, this.y + addendY);
  }

  /**
   * subtracts another Vector's x and y from this Vector, and returns the
   * result as a new Vector
   * @param other the other Vector
   */
  public subtract(other: Vector): Vector;

  /**
   * subtracts the given subtrahends from this Vector's x and y
   * @param sx x subtrahend
   * @param sy y subtrahend. Equal to sx if omitted
   */
  public subtract(sx: number, sy?: number): Vector;

  public subtract(arg1: number | Vector, arg2?: number): Vector {
    const subtrahendX: number = (arg1 as Vector).x ?? (arg1 as number);
    const subtrahendY = (arg1 as Vector).y ?? arg2 ?? subtrahendX;
    return new Vector(this.x - subtrahendX, this.y - subtrahendY);
  }

  /**
   * divides this Vector's x and y by another Vector's x and y and returns the
   * result as a new Vector
   * @param other the other Vector
   */
  public divide(other: Vector): Vector;

  /**
   * divides this Vector's x and y by the given divisors. If it would divide an
   * attribute by zero, it returns that attribute unmodified instead
   * @param dx x divisor
   * @param dy y divisor. Equal to dx if omitted
   */
  public divide(dx: number, dy?: number): Vector;

  public divide(arg1: number | Vector, arg2?: number): Vector {
    const divisorX: number = (arg1 as Vector).x ?? (arg1 as number);
    const divisorY = (arg1 as Vector).y ?? arg2 ?? divisorX;
    // guard against division by zero
    const newX = divisorX === 0 ? this.x : this.x / divisorX;
    const newY = divisorY === 0 ? this.y : this.y / divisorY;
    return new Vector(newX, newY);
  }

  /**
   * calculates the dot product of this Vector and another Vector
   * @param other the other vector
   */
  public dot(other: Vector): number {
    return this.x * other.x + this.y * other.y;
  }

  /**
   * Normalizes this Vector, returning a Vector with the same direction but a
   * magnitude of 1.
   */
  public normalize(): Vector {
    return this.divide(this.getMagnitude());
  }

  /**
   * Returns a Vector pointing to halfway in between this Vector and another
   */
  public getMidpoint(other: Vector): Vector {
    return new Vector((this.x + other.x) / 2, (this.y + other.y) / 2);
  }

  /**
   * Find th orientation of three ordered points, (p, q, r)
   * @param p first vector
   * @param q second vector
   * @param r third vector
   * @return 0 if collinear, 1 if clockwise, or -1 if counterclockwise
   */
  public static orientation(p: Vector, q: Vector, r: Vector): -1 | 0 | 1 {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val == 0) return 0; // collinear
    return val > 0 ? 1 : -1; // clockwise or counterclockwise
  }
}

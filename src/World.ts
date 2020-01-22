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
 * A World represents a type of gameplay, for example "battle" or "free roam".
 * Worlds know how they are supposed to be drawn
 */
export abstract class World {
  /** type identifier of this world */
  private type: string;

  public constructor() {
    this.setType("World");
  }

  /**
   * set type identifier of this World
   * @param newType new type identifier
   */
  public setType(newType: string): void {
    this.type = newType;
  }

  /**
   * @return the type identifier of this world
   */
  public getType(): string {
    return this.type;
  }

  /**
   * draw this world to the canvas
   * @param ctx the canvas context to draw on
   */
  public abstract draw(ctx: CanvasRenderingContext2D): void;

  /**
   * action to be performed every step
   * @param stepCount number of this step
   */
  public abstract step(stepCount: number): void;

  /**
   * optional method to call when we leave this world
   */
  public exit(): void {
    return;
  }
}

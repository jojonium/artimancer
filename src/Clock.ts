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
 * Clock class used for timing game steps
 */
export class Clock {
  private previousTime: number; // previous time reading, in milliseconds

  /**
   * Initializes previousTime to the current time
   */
  public constructor() {
    // window.performance.now() uses the High Resolution Time API, and is much
    // more accurate than Date.getTime(). See <https://www.w3.org/TR/hr-time/>
    // for details
    this.previousTime = window.performance.now();
  }

  /**
   * returns time elapsed in milliseconds since delta() was last called and
   * resets clock time.
   *
   */
  public delta(): number {
    const afterTime = window.performance.now();
    const elapsed = afterTime - this.previousTime;
    this.previousTime = afterTime;
    return elapsed;
  }

  /**
   * returns time elapsed in milliseconds since delta() was last called and
   * does NOT reset clock time
   */
  public split(): number {
    return window.performance.now() - this.previousTime;
  }
}

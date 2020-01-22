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
 * Manager super-class that other Managers inherit from
 */
export class Manager {
  private isStarted: boolean; // true if this manager has started
  private type: string; // type identifier

  public constructor() {
    this.isStarted = false;
    this.setType("Manager");
  }

  /**
   * Starts up this manager. Throws an error if something goes wrong
   */
  public startUp(): void {
    this.isStarted = true;
  }

  /**
   * @param newType new type identifier for this manager
   */
  protected setType(newType: string): void {
    this.type = newType;
  }
}

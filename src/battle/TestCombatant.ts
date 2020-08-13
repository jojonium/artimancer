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
import { Combatant } from "./Combatant";
import { Vector } from "../Vector";

/** Plain Combatant for test purposes */
export class TestCombatant extends Combatant {
  public constructor() {
    super();
  }

  public isEnemy(): boolean {
    return false;
  }

  public async takeTurn(): Promise<void> {
    return Promise.resolve(undefined);
  }

  public draw(
    ctx: CanvasRenderingContext2D,
    center: Vector,
    maxHeight: number
  ): void {
    ctx.save();
    ctx.fillStyle = "blue";
    ctx.fillRect(center.x - 40, center.y - maxHeight / 2, 80, maxHeight);
    ctx.restore();
  }
}

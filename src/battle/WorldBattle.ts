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

import { World } from "../World";
import { Combatant } from "./Combatant";

/** Coordinates and draws a turn-based battle */
export class WorldBattle extends World {
  /** whether to log info */
  private noisy = true;
  /** participants on the left side of the screen, top to bottom */
  private readonly leftCombatants: Array<Combatant>;
  /** participants on the right side of the screen, top to bottom */
  private readonly rightCombatants: Array<Combatant>;
  /** queue of participants in turn order for this round */
  private upNext: Array<Combatant>;

  /**
   * @param leftCombatants must contain 1-5 Combatants
   * @param rightCombatants must contain 1-5 Combatants
   */
  public constructor(
    leftCombatants: Array<Combatant>,
    rightCombatants: Array<Combatant>
  ) {
    super();
    if (leftCombatants.length < 1 || leftCombatants.length > 5) {
      throw new Error(
        "WorldBattle constructor: leftCombatants must have length 1-5, not " +
          leftCombatants.length
      );
    }
    if (rightCombatants.length < 1 || rightCombatants.length > 5) {
      throw new Error(
        "WorldBattle constructor: rightCombatants must have length 1-5, not " +
          rightCombatants.length
      );
    }
    this.setType("Battle");
    this.leftCombatants = leftCombatants;
    this.rightCombatants = rightCombatants;
    this.upNext = [];
  }

  private allCombatants(): Array<Combatant> {
    return [...this.leftCombatants, ...this.rightCombatants];
  }

  /** clears upNext, then populates it with combatants in speed order */
  private calculateTurnOrder(): void {
    this.upNext = this.allCombatants().sort((a, b) => {
      const diff = b.traits.speed - a.traits.speed;
      if (diff !== 0) return diff;
      // equal speeds get sorted randomly
      return 0.5 - Math.random();
    });
  }

  /** @override */
  public enter(): void {
    if (this.noisy) console.log("Entering a Battle");
    this.calculateTurnOrder();
    this.takeTurn();
  }

  /** the combatant who is up next takes a turn */
  private takeTurn(): void {
    if (!this.allCombatants().some(c => c.isEnemy())) {
      // no enemies left, the player won
      // TODO implement
      return;
    }
    if (this.upNext.length === 0) {
      // end of round
      this.calculateTurnOrder();
    }
    this.upNext[0].takeTurn().then(() => {
      this.upNext.shift();
      this.takeTurn();
    });
  }

  /** @override */
  public draw(ctx: CanvasRenderingContext2D): void {
    // TODO draw background
    return;
  }

  /** @override */
  public step(): void {
    // TODO implement
    return;
  }
}

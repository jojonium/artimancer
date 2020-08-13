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

import { Sprite } from "../Sprite";
import { RM } from "../ResourceManager";
import { Box } from "../Box";
import { Vector } from "../Vector";

/** variable core characteristics belonging to a combatant */
export type CombatantTraits = {
  /** higher speed goes first in a round */
  speed: number;
  /** health points, combatant dies when it reaches zero */
  hp: number;
};

/**
 * An enemy or ally involved in a battle.
 * A Combatant's lifetime is only for one battle, it is destroyed after the
 * battle is over
 */
export abstract class Combatant {
  /** displayed name of the combatant */
  private name = "Unnamed Combatant";
  /** variable characteristics like strength, speed, and hp */
  public traits: CombatantTraits = {
    speed: 1,
    hp: Infinity
  };
  /** statistics from this battle */
  private stats = {
    damageDealt: 0,
    damageTaken: 0,
    kills: 0
  };
  /** sprite for the platform this combatant stands on in battle */
  private platformSprite: Sprite | undefined = undefined;

  /**
   * this combatant takes its turn in the battle, resolving the promise when
   * it is done
   */
  public abstract async takeTurn(): Promise<void>;

  /** returns true if this is an enemy and false if it is an ally or neutral */
  public abstract isEnemy(): boolean;

  /**
   * draws the platform for this combatant to stand on
   * @param ctx the canvas context to draw on
   * @param drawBox specifies the position and size in which to draw
   */
  public drawPlatform(ctx: CanvasRenderingContext2D, drawBox: Box): void {
    const sprite = this.platformSprite ?? RM.getSprite("default-platform");
    if (sprite === undefined) {
      throw new Error("Combatant: Failed to get platform sprite");
    }
    ctx.drawImage(
      sprite.getCurrentFrame().getImage(),
      drawBox.topLeft.x,
      drawBox.topLeft.y,
      drawBox.width,
      drawBox.height
    );
  }

  /**
   * draws the combatant within the given box
   * @param ctx the canvas context to draw on
   * @param center the middle of the drawable area. The area's width is
   * theoretically unlimited
   * @param maxHeight maximum height of the drawable area
   */
  public abstract draw(
    ctx: CanvasRenderingContext2D,
    center: Vector,
    maxHeight: number
  ): void;
}

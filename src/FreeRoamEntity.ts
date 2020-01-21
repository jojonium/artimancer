import { Vector } from "./Vector";
import { Sprite } from "./Sprite";

/**
 * This class represents an entity, such as a player character, NPC, or enemy,
 * in the free roam world
 */
export class FreeRoamEntity {
  /** string identifier for this entity */
  private label: string;
  /** position of this entity */
  private pos: Vector;
  /** sprite for this entity */
  private sprite: Sprite;

  /**
   * Constructs a new FreeRoamEntity
   * @param label string identifier for this entity
   * @param pos where this entity is
   * @param sprite sprite for this entity
   */
  public constructor(label: string, pos: Vector, sprite: Sprite) {
    this.label = label;
    this.pos = pos;
    this.sprite = sprite;
  }
}

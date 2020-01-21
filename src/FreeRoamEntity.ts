import { Vector } from "./Vector";

/**
 * This class represents an entity, such as a player character, NPC, or enemy,
 * in the free roam world
 */
export abstract class FreeRoamEntity {
  /** string identifier for this entity */
  private label: string;
  /** position of this entity */
  private pos: Vector;
  /** direction the entity is facing */
  private dir: Vector;
  /** width of this entity as a ratio of the total screen width */
  private width: number;
  /** height of this entity as a ratio of the total screen width */
  private height: number;

  /**
   * Constructs a new FreeRoamEntity
   * @param label string identifier for this entity
   * @param pos where this entity is
   */
  public constructor(label: string, pos: Vector) {
    this.label = label;
    this.pos = pos;
    // start facing right
    this.dir = new Vector(1, 0);
  }

  /**
   * Draws this entity
   * @param ctx the canvas context to draw on
   * @param w width of the canvas
   * @param h height of the canvas
   */
  public abstract draw(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number
  ): void;
}

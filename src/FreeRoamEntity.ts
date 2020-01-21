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
  /** width of this entity in pixels on a CANV_SIZE by CANV_SIZE canvas */
  private width: number;
  /** height of this entity in pixels on a CANV_SIZE by CANV_SIZE canvas */
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
   */
  public abstract draw(ctx: CanvasRenderingContext2D): void;
}

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
}

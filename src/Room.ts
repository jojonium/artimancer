import { Sprite } from "./Sprite";
import { Vector } from "./Vector";

export type Layer = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * The Room class represents a single area of the free-roam world, and includes
 * a background, NPCs, enemies, and other objects
 */
export class Room {
  /** identifier for this room */
  private label: string;
  private backgrounds: {
    sprite: Sprite;
    centerPos: Vector;
    width: number;
    height: number;
  }[][];

  /**
   * Constructs a new room
   * @param label a string identifier for this room
   */
  public constructor(label: string) {
    this.label = label;
    this.backgrounds = new Array<[]>(6);
  }

  /**
   * Adds a piece of the background for this room
   * @param sprite the sprite of this background piece
   * @param layer 0-5, higher layers are drawn on top of lower ones
   */
  private addBackground(
    sprite: Sprite,
    centerPos: Vector,
    width: number,
    height: number,
    layer: Layer = 0
  ): void {
    this.backgrounds[layer].push({
      sprite: sprite,
      centerPos: centerPos,
      width: width,
      height: height
    });
  }

  /**
   * draw this room to the canvas
   * @param ctx the canvas context to draw on
   * @param w width of the canvas
   * @param h height of the canvas
   */
  public draw(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    this.backgrounds.forEach(layer => {
      layer.forEach(obj => {
        const x = obj.centerPos.x - obj.width / 2;
        const y = obj.centerPos.y - obj.height / 2;
        ctx.drawImage(
          obj.sprite.getCurrentFrame().getImage(),
          x,
          y,
          obj.width,
          obj.height
        );
      });
    });
  }
}

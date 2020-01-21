import { Sprite } from "./Sprite";
import { Vector } from "./Vector";
import { FreeRoamEntity } from "./FreeRoamEntity";

export type Layer = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * The Room class represents a single area of the free-roam world, and includes
 * a background, NPCs, enemies, and other objects
 */
export class Room {
  /** unique identifier for this room */
  private label: string;
  /** elements that make up the visual background of this room */
  private backgrounds: {
    sprite: Sprite;
    centerPos: Vector;
    width: number; // pixels, scaled to a CANV_SIZE by CANV_SIZE canvas
    height: number; // pixels, scaled to a CANV_SIZE by CANV_SIZE canvas
  }[][];
  /** all free roam entities in this room */
  private entities: FreeRoamEntity[];

  /**
   * Constructs a new room
   * @param label a string identifier for this room
   */
  public constructor(label: string) {
    this.label = label;
    this.backgrounds = new Array<[]>(6);
    for (let i = 0; i < 6; ++i) {
      this.backgrounds[i] = [];
    }
    this.entities = [];
  }

  /**
   * @return this Room's unique string identifier
   */
  public getLabel(): string {
    return this.label;
  }

  /**
   * Adds a piece of the background for this room
   * @param sprite the sprite of this background piece
   * @param layer 0-5, higher layers are drawn on top of lower ones
   */
  public addBackground(
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
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    // draw all backgrounds layer by layer
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

    // draw all entities on top of the background
    this.entities.map(ent => ent.draw(ctx));
  }
}

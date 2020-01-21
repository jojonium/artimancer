import { Room } from "./Room";
import { WorldFreeRoam } from "./WorldFreeRoam";
import { Vector } from "./Vector";
import { Polygon } from "./Polygon";

/**
 * This class is for development purposes, and allows for easy graphical
 * editing of room backgrounds and collisison boundaries
 */
export class WorldRoomEditor extends WorldFreeRoam {
  /** all finished bounding polygons */
  private completedPolygons: Polygon[];
  /** the polygon currently being worked on */
  private currentPolygon: Polygon;

  /**
   * Constructs a new RoomEditor world for a given room
   * @param room the room to edit
   */
  public constructor(room: Room) {
    super();
    this.setType("Room Editor");
    this.setRoom(room);

    // add event listeners to the canvas
    document
      .getElementById("canvas")
      .removeEventListener("mousedown", this.mousedownHandler.bind(this));
    document
      .getElementById("canvas")
      .addEventListener("mousedown", this.mousedownHandler.bind(this));
  }

  /**
   * handles the user clicking on the canvas
   * @param ev the mouse event produced by the click
   */
  public mousedownHandler(ev: MouseEvent): void {
    const canvas = document.getElementById("canvas");
    const rect = canvas.getBoundingClientRect();
    const vec = new Vector(ev.clientX - rect.left, ev.clientY - rect.top);
    console.log(`${vec.x}, ${vec.y}`);
    if (this.currentPolygon === null || this.currentPolygon === undefined) {
      this.currentPolygon = new Polygon();
    }
    this.currentPolygon.addPoints(vec);
    if (ev.shiftKey) {
      // try to close the polygon
      if (this.currentPolygon.closePath()) {
        this.completedPolygons.push(this.currentPolygon);
        this.currentPolygon = null;
      }
    }
    console.log(this.currentPolygon);
  }

  /**
   * remove event listeners
   */
  public exit(): void {
    document
      .getElementById("canvas")
      .removeEventListener("mousedown", this.mousedownHandler.bind(this));
  }

  /**
   * draw the room normally, then draw collision boundaries on top of it
   * @override
   * @param ctx the canvas context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    // draw current polygon in red
    if (this.currentPolygon && this.currentPolygon.getPoints().length > 0) {
      console.log(this.currentPolygon);
      ctx.lineWidth = 15;
      ctx.strokeStyle = "red";
      ctx.beginPath();
      const points = this.currentPolygon.getPoints();
      ctx.moveTo(points[0].x, points[0].y);
      this.currentPolygon.getPoints().forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }
  }
}

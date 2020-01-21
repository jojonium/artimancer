import { Room } from "./Room";
import { WorldFreeRoam } from "./WorldFreeRoam";
import { Vector } from "./Vector";
import { Polygon } from "./Polygon";
import { DM } from "./DisplayManager";
import { IM } from "./InputManager";

/**
 * This class is for development purposes, and allows for easy graphical
 * editing of room backgrounds and collisison boundaries
 */
export class WorldRoomEditor extends WorldFreeRoam {
  /** all finished bounding polygons */
  private completedPolygons: Polygon[];
  /** the polygon currently being worked on */
  private currentPolygon: Polygon;
  /** current mouse location */
  private mousePos: Vector;

  /**
   * Constructs a new RoomEditor world for a given room
   * @param room the room to edit
   */
  public constructor(room: Room) {
    super();
    this.setType("Room Editor");
    this.setRoom(room);
    this.completedPolygons = new Array<Polygon>();

    // set button controls
    IM.setOnPressed("escape", this.cancel.bind(this));

    // add event listeners to the canvas
    document
      .getElementById("canvas")
      .removeEventListener("mousedown", this.mousedownHandler.bind(this));
    document
      .getElementById("canvas")
      .addEventListener("mousedown", this.mousedownHandler.bind(this));
    document
      .getElementById("canvas")
      .removeEventListener("mousemove", this.mousemoveHandler.bind(this));
    document
      .getElementById("canvas")
      .addEventListener("mousemove", this.mousemoveHandler.bind(this));
  }

  /**
   * handles the user clicking on the canvas
   * @param ev the mouse event produced by the click
   */
  public mousedownHandler(ev: MouseEvent): void {
    const vec = DM.windowToWorldCoord(new Vector(ev.clientX, ev.clientY));
    this.mousePos = vec;
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
  }

  /**
   * cancels any pending operations, such as drawing a polygon
   */
  public cancel(): void {
    this.currentPolygon = null;
  }

  /**
   * handles mouse movements over the canvas, updating this.mousePos
   * @param ev the mouse event produced by the mouse movement
   */
  public mousemoveHandler(ev: MouseEvent): void {
    this.mousePos = DM.windowToWorldCoord(new Vector(ev.clientX, ev.clientY));
  }

  /**
   * remove event listeners
   */
  public exit(): void {
    document
      .getElementById("canvas")
      .removeEventListener("mousedown", this.mousedownHandler.bind(this));
    document
      .getElementById("canvas")
      .removeEventListener("mousemove", this.mousemoveHandler.bind(this));
  }

  /**
   * draw the room normally, then draw collision boundaries on top of it
   * @override
   * @param ctx the canvas context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    // draw completed polygons in blue
    for (const p of this.completedPolygons) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(0, 162, 234, 1)";
      ctx.fillStyle = "rgba(0, 122, 204, 0.4)";
      ctx.setLineDash([0]);
      ctx.beginPath();
      ctx.moveTo(p.getPoints()[0].x, p.getPoints()[0].y);
      p.getPoints().forEach(point => ctx.lineTo(point.x, point.y));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // draw current polygon in red
    if (this.currentPolygon && this.currentPolygon.getPoints().length > 0) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "red";
      ctx.beginPath();
      const points = this.currentPolygon.getPoints();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.stroke();
      if (this.mousePos) {
        ctx.lineTo(this.mousePos.x, this.mousePos.y);
        ctx.stroke();
        ctx.setLineDash([8, 5]);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }
}

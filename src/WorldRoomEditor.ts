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

import { Room } from "./Room";
import { WorldFreeRoam } from "./WorldFreeRoam";
import { Vector } from "./Vector";
import { Polygon } from "./Polygon";
import { DM } from "./DisplayManager";
import { IM, noOp } from "./InputManager";
import { UIElement } from "./UIElement";
import { RM } from "./ResourceManager";

enum Mode {
  select,
  drawBarrier
}

/**
 * This class is for development purposes, and allows for easy graphical
 * editing of room backgrounds and collisison boundaries
 */
export class WorldRoomEditor extends WorldFreeRoam {
  /** all finished bounding polygons */
  private completedPolygons: Polygon[];
  /** the polygon currently being worked on */
  private currentPolygon: Polygon | undefined;
  /** current mouse location */
  private mousePos: Vector;
  /** current editing mode */
  private mode: Mode;
  /** UI elements this world displays */
  private uiElements: UIElement[];

  /**
   * Constructs a new RoomEditor world for a given room
   * @param room the room to edit
   */
  public constructor(room: Room) {
    super();
    this.setType("Room Editor");
    this.setRoom(room);
    this.completedPolygons = new Array<Polygon>();
    this.mode = Mode.drawBarrier;
    this.mousePos = new Vector(0, 0);
    this.uiElements = new Array<UIElement>(3);
    this.uiElements[0] = new UIElement("edit-menu-move");
    this.uiElements[0].setWidth(300);
    this.uiElements[0].setHeight(150);
    this.uiElements[0].style = {
      bgSprite: RM.getSprite("edit-menu-move")
    };
    this.uiElements[1] = new UIElement("edit-menu-barrier");
    this.uiElements[1].setWidth(300);
    this.uiElements[1].setHeight(150);
    this.uiElements[1].style = {
      bgSprite: RM.getSprite("edit-menu-barrier")
    };
    this.uiElements[2] = new UIElement("edit-instructions-barrier");
    this.uiElements[2].setWidth(300);
    this.uiElements[2].setHeight(100);
    this.uiElements[2].style = {
      font: "bold 20px Bitter",
      fontFill: "#d2d2d2",
      lineHeight: 25,
      textAlign: "right",
      padding: 5
    };
    this.uiElements[2].setText("Shift+click to complete\nTab to cancel");
    this.setMode(Mode.drawBarrier);
  }

  /**
   * handles the user clicking on the canvas in draw mode
   * @param ev the mouse event produced by the click
   */
  private drawMousedownHandler(ev: MouseEvent): void {
    const vec = DM.windowToWorldCoord(new Vector(ev.clientX, ev.clientY));
    this.mousePos = vec;
    if (this.currentPolygon === null || this.currentPolygon === undefined) {
      this.currentPolygon = new Polygon();
    }
    this.currentPolygon.addPoints(vec);
    if (ev.shiftKey) {
      // try to close the polygon
      if (this.currentPolygon.getPoints().length > 2) {
        this.completedPolygons.push(this.currentPolygon);
        this.currentPolygon = undefined;
      }
    }
  }

  /**
   * cancels any pending operations, such as drawing a polygon
   */
  public cancel(): void {
    this.currentPolygon = undefined;
  }

  /**
   * handles mouse movements over the canvas, updating this.mousePos
   * @param ev the mouse event produced by the mouse movement
   */
  private mousemoveHandler(ev: MouseEvent): void {
    this.mousePos = DM.windowToWorldCoord(new Vector(ev.clientX, ev.clientY));
  }

  /**
   * remove event listeners and clear buttons
   * @override
   */
  public exit(): void {
    this.resetControls();
    DM.setCornerUI("top left", undefined);
    DM.setCornerUI("top right", undefined);
    IM.unregisterButton("select-mode");
    IM.unregisterButton("barrier-mode");
  }

  /**
   * Set default button inputs
   */
  public enter(): void {
    IM.registerButton("select-mode", "m");
    IM.setOnPressed("select-mode", () => {
      this.setMode(Mode.select);
    });
    IM.registerButton("barrier-mode", "b");
    IM.setOnPressed("barrier-mode", () => {
      this.setMode(Mode.drawBarrier);
    });
  }

  /**
   * Removes all event listeners and clears all buttons, other than the ones to
   * switch modes
   */
  private resetControls(): void {
    IM.setMouseDown(noOp);
    IM.setMouseMove(noOp);
    IM.setOnPressed("escape", noOp);
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
      ctx.strokeStyle = "rgba(255, 0, 0, 1)";
      ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
      ctx.beginPath();
      const points = this.currentPolygon.getPoints();
      ctx.moveTo(points[0].x, points[0].y);
      points.forEach(point => ctx.lineTo(point.x, point.y));
      if (this.mode === Mode.select) {
        ctx.closePath();
        ctx.fill();
      }
      ctx.stroke();
      // draw line to mouse that also completes the polygon
      if (this.mode === Mode.drawBarrier && this.mousePos) {
        ctx.lineTo(this.mousePos.x, this.mousePos.y);
        ctx.stroke();
        ctx.setLineDash([8, 5]);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  /**
   * handles a mouse down event in select/move mode
   * @param ev Mouse Event generated by the mouse click
   */
  public selectMousedownHandler(ev: MouseEvent): void {
    const vec = DM.windowToWorldCoord(new Vector(ev.clientX, ev.clientY));
    this.mousePos = vec;

    // figure out if we clicked on something
    for (const p of this.completedPolygons) {
      if (p.contains(vec)) {
        this.currentPolygon = p;
        return;
      }
    }

    // nothing was clicked on, deselect
    this.currentPolygon = undefined;
  }

  /**
   * handles a mouse up event in select/move mode
   * @param ev the mouse event generated by the mouse release
   */
  public selectMouseupHandler(ev: MouseEvent): void {
    const vec = DM.windowToWorldCoord(new Vector(ev.clientX, ev.clientY));
    this.mousePos = vec;
  }

  /**
   * @param newMode the mode to enter
   */
  public setMode(newMode: Mode): void {
    this.mode = newMode;

    // remove existing event handlers
    this.resetControls();
    if (this.mode === Mode.drawBarrier) {
      // set button controls
      IM.setOnPressed("escape", this.cancel.bind(this));
      IM.setMouseDown(this.drawMousedownHandler.bind(this));
      IM.setMouseMove(this.mousemoveHandler.bind(this));

      // set UI element
      DM.setCornerUI("top left", this.uiElements[1]);
      DM.setCornerUI("top right", this.uiElements[2]);
    } else if (this.mode === Mode.select) {
      IM.setOnPressed("escape", this.cancel.bind(this));
      IM.setMouseDown(this.selectMousedownHandler.bind(this));
      IM.setMouseUp(this.selectMouseupHandler.bind(this));
      IM.setMouseMove(this.mousemoveHandler.bind(this));
      // set UI element
      DM.setCornerUI("top left", this.uiElements[0]);
      DM.setCornerUI("top right", undefined);
    }
  }
}

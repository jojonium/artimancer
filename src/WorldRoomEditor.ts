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

import { Room, bgObject } from "./Room";
import { WorldFreeRoam } from "./WorldFreeRoam";
import { Vector } from "./Vector";
import { Polygon } from "./Polygon";
import { DM } from "./DisplayManager";
import { IM, noOp } from "./InputManager";
import { UIElement } from "./UIElement";
import { RM } from "./ResourceManager";
import { Box } from "./Box";

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
  /** the currently selected background element */
  private selectedBgObj: bgObject | undefined;
  /** current mouse location */
  private mousePos: Vector;
  /** whether the mouse is currently down */
  private mouseIsDown = false;
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
    this.uiElements = new Array<UIElement>(4);
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
    this.uiElements[3] = new UIElement("edit-instructions-move");
    this.uiElements[3].setWidth(300);
    this.uiElements[3].setHeight(100);
    this.uiElements[3].style = {
      font: "bold 20px Bitter",
      fontFill: "#d2d2d2",
      lineHeight: 25,
      textAlign: "right",
      padding: 5
    };
    this.uiElements[3].setText("Click+drag to move\nDelete to delete");
    this.setMode(Mode.drawBarrier);
  }

  /**
   * handles the user clicking on the canvas in draw mode
   * @param ev the mouse event produced by the click
   */
  private drawMousedownHandler(ev: MouseEvent): void {
    this.mouseIsDown = true;
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
   * cancels any pending operations, such as drawing a polygon, and deselects
   * everything
   */
  public cancel(): void {
    this.currentPolygon = undefined;
    this.selectedBgObj = undefined;
  }

  /**
   * handles mouse movements over the canvas, updating this.mousePos
   * @param ev the mouse event produced by the mouse movement
   */
  private mousemoveHandler(ev: MouseEvent): void {
    const vec = DM.windowToWorldCoord(new Vector(ev.clientX, ev.clientY));
    if (this.mouseIsDown && this.mousePos && this.mode === Mode.select) {
      const delta = vec.subtract(this.mousePos);
      // drag polygons
      if (this.currentPolygon !== undefined) {
        this.currentPolygon.translate(delta);
      }
      // drag bg sprites
      if (this.selectedBgObj !== undefined) {
        this.selectedBgObj.centerPos = this.selectedBgObj.centerPos.add(delta);
      }
    }
    this.mousePos = vec;
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
    IM.registerButton("delete", "Delete");
  }

  /**
   * Removes all event listeners and clears all buttons, other than the ones to
   * switch modes
   */
  private resetControls(): void {
    IM.setMouseDown(noOp);
    IM.setMouseMove(noOp);
    IM.setOnPressed("escape", noOp);
    IM.setOnPressed("delete", noOp);
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

    // draw red box around selected bg object
    if (this.selectedBgObj !== undefined) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255, 0, 0, 1)";
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.beginPath();
      const tl = this.selectedBgObj.centerPos.subtract(
        this.selectedBgObj.width / 2,
        this.selectedBgObj.height / 2
      );
      ctx.rect(tl.x, tl.y, this.selectedBgObj.width, this.selectedBgObj.height);
      ctx.stroke();
    }
  }

  /**
   * handles a mouse down event in select/move mode
   * @param ev Mouse Event generated by the mouse click
   */
  public selectMousedownHandler(ev: MouseEvent): void {
    this.cancel();
    this.mouseIsDown = true;
    const vec = DM.windowToWorldCoord(new Vector(ev.clientX, ev.clientY));
    this.mousePos = vec;

    // figure out if we clicked on something
    for (const p of this.completedPolygons) {
      if (p.contains(vec)) {
        this.currentPolygon = p;
        return;
      }
    }

    if (this.currentRoom !== undefined) {
      const layers = this.currentRoom.getBackgrounds();
      for (let i = layers.length - 1; i >= 0; --i) {
        // check from the top down
        for (const s of layers[i]) {
          const b = new Box(
            s.centerPos.subtract(s.width / 2, s.height / 2),
            s.width,
            s.height
          );
          if (b.contains(vec)) {
            this.selectedBgObj = s;
            return;
          }
        }
      }
    }
  }

  /**
   * deletes the currently selected element
   */
  private delete(): void {
    if (this.currentPolygon) {
      const index = this.completedPolygons.indexOf(this.currentPolygon);
      if (index > -1) {
        this.completedPolygons.splice(index, 1);
        this.currentPolygon = undefined;
      }
      return;
    }
    if (this.selectedBgObj && this.currentRoom) {
      const layers = this.currentRoom.getBackgrounds();
      for (const layer of layers) {
        const index = layer.indexOf(this.selectedBgObj);
        if (index > -1) {
          layer.splice(index, 1);
          this.selectedBgObj = undefined;
          return;
        }
      }
    }
  }

  /**
   * handles a mouse up event in select/move mode
   * @param ev the mouse event generated by the mouse release
   */
  public selectMouseupHandler(ev: MouseEvent): void {
    this.mouseIsDown = false;
    const vec = DM.windowToWorldCoord(new Vector(ev.clientX, ev.clientY));
    this.mousePos = vec;
  }

  /**
   * @param newMode the mode to enter
   */
  public setMode(newMode: Mode): void {
    this.currentPolygon = undefined;
    this.selectedBgObj = undefined;
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
      IM.setOnPressed("delete", this.delete.bind(this));
      IM.setMouseDown(this.selectMousedownHandler.bind(this));
      IM.setMouseUp(this.selectMouseupHandler.bind(this));
      IM.setMouseMove(this.mousemoveHandler.bind(this));
      // set UI element
      DM.setCornerUI("top left", this.uiElements[0]);
      DM.setCornerUI("top right", this.uiElements[3]);
    }
  }
}

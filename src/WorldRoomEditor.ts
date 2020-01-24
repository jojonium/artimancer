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
import { FreeRoamEntity } from "./FreeRoamEntity";

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
  private selectedPolygon: Polygon | undefined;
  /** the currently selected background element */
  private selectedBgObj: bgObject | undefined;
  /** the currently selected FreeRoamEntity */
  private selectedEntity: FreeRoamEntity | undefined;
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
    this.selectedEntity = undefined;
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
    this.uiElements[3].setText(
      "Click+drag to move\nShift+drag to scale\nDelete to delete"
    );
    this.setMode(Mode.drawBarrier);
  }

  /**
   * cancels any pending operations, such as drawing a polygon, and deselects
   * everything
   */
  public cancel(): void {
    this.selectedPolygon = undefined;
    this.selectedBgObj = undefined;
    this.selectedEntity = undefined;
  }

  /**
   * handles mouse movements over the canvas, updating this.mousePos
   * @param ev the mouse event produced by the mouse movement
   */
  private mousemoveHandler(ev: MouseEvent): void {
    const vec = DM.windowToWorldCoord(new Vector(ev.clientX, ev.clientY));
    if (this.mouseIsDown && this.mousePos && this.mode === Mode.select) {
      const delta = vec.subtract(this.mousePos);
      if (ev.shiftKey) {
        // if holding shift, scale whatever's selected
        // scale polygons TODO implement
        if (this.selectedPolygon !== undefined) {
          this.selectedPolygon.scale(
            delta.distanceTo(this.selectedPolygon.getCenter())
          );
        }

        // scale bg sprites
        if (this.selectedBgObj !== undefined) {
          const b = this.selectedBgObj.box;
          const x = vec.subtract(b.getCenter()).x > 0 ? delta.x : -delta.x;
          const y = vec.subtract(b.getCenter()).y > 0 ? delta.y : -delta.y;
          b.topLeft = b.topLeft.subtract(x / 2, y / 2);
          b.width += x;
          b.height += y;
          this.selectedBgObj.box = b;
        }

        // scale entities
        if (this.selectedEntity !== undefined) {
          const b = this.selectedEntity.drawBox;
          const x = vec.subtract(b.getCenter()).x > 0 ? delta.x : -delta.x;
          const y = vec.subtract(b.getCenter()).y > 0 ? delta.y : -delta.y;
          b.topLeft = b.topLeft.subtract(x / 2, y / 2);
          b.width += x;
          b.height += y;
          this.selectedEntity.drawBox = b;
        }
      } else {
        // otherwise drag whatever's selected
        // drag polygons
        if (this.selectedPolygon !== undefined) {
          this.selectedPolygon.translate(delta);
        }
        // drag bg sprites
        if (this.selectedBgObj !== undefined) {
          this.selectedBgObj.box.topLeft = this.selectedBgObj.box.topLeft.add(
            delta
          );
        }
        // drag entities
        if (this.selectedEntity !== undefined) {
          const b = this.selectedEntity.drawBox;
          b.topLeft = b.topLeft.add(delta);
        }
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
    if (this.selectedPolygon && this.selectedPolygon.getPoints().length > 0) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255, 0, 0, 1)";
      ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
      ctx.beginPath();
      const points = this.selectedPolygon.getPoints();
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
      this.selectedBgObj.box.drawRect(ctx);
      ctx.stroke();
    }

    // draw red box around selected entity
    if (this.selectedEntity !== undefined) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255, 0, 0, 1)";
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
      ctx.beginPath();
      this.selectedEntity.drawBox.drawRect(ctx);
      ctx.stroke();
    }
  }

  /**
   * handles a mouse down event according to the mode
   * @param ev Mouse Event generated by the mouse click
   */
  public mousedownHandler(ev: MouseEvent): void {
    this.mouseIsDown = true;
    const vec = DM.windowToWorldCoord(new Vector(ev.clientX, ev.clientY));
    this.mousePos = vec;

    if (this.mode === Mode.drawBarrier) {
      if (this.selectedPolygon === null || this.selectedPolygon === undefined) {
        this.selectedPolygon = new Polygon();
      }
      this.selectedPolygon.addPoints(vec);
      if (ev.shiftKey) {
        // try to close the polygon
        if (this.selectedPolygon.getPoints().length > 2) {
          this.completedPolygons.push(this.selectedPolygon);
          this.selectedPolygon = undefined;
        }
      }
    } else if (this.mode === Mode.select && !ev.shiftKey) {
      this.cancel();

      // did we click on a polygon?
      for (const p of this.completedPolygons) {
        if (p.contains(vec)) {
          this.selectedPolygon = p;
          return;
        }
      }

      if (this.currentRoom !== undefined) {
        const layers = this.currentRoom.getBackgrounds();
        // did we click an entity?
        for (const e of this.currentRoom.getEntities()) {
          if (e.drawBox.contains(vec)) {
            this.selectedEntity = e;
            return;
          }
        }

        // did we click on a background?
        for (let i = layers.length - 1; i >= 0; --i) {
          // check from the top down
          for (const s of layers[i]) {
            if (s.box.contains(vec)) {
              this.selectedBgObj = s;
              return;
            }
          }
        }
      }
    }
  }

  /**
   * deletes the currently selected element
   */
  private delete(): void {
    if (this.selectedPolygon) {
      const index = this.completedPolygons.indexOf(this.selectedPolygon);
      if (index > -1) {
        this.completedPolygons.splice(index, 1);
        this.selectedPolygon = undefined;
      }
      return;
    }
    if (this.currentRoom && this.selectedBgObj) {
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
    if (this.currentRoom && this.selectedEntity) {
      const index = this.currentRoom.getEntities().indexOf(this.selectedEntity);
      if (index > -1) {
        this.currentRoom.getEntities().splice(index, 1);
        this.selectedEntity = undefined;
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
    this.mode = newMode;

    // remove existing event handlers
    this.resetControls();
    this.cancel();
    if (this.mode === Mode.drawBarrier) {
      // set button controls
      IM.setOnPressed("escape", this.cancel.bind(this));
      IM.setMouseDown(this.mousedownHandler.bind(this));
      IM.setMouseMove(this.mousemoveHandler.bind(this));

      // set UI element
      DM.setCornerUI("top left", this.uiElements[1]);
      DM.setCornerUI("top right", this.uiElements[2]);
    } else if (this.mode === Mode.select) {
      IM.setOnPressed("escape", this.cancel.bind(this));
      IM.setOnPressed("delete", this.delete.bind(this));
      IM.setMouseDown(this.mousedownHandler.bind(this));
      IM.setMouseUp(this.selectMouseupHandler.bind(this));
      IM.setMouseMove(this.mousemoveHandler.bind(this));
      // set UI element
      DM.setCornerUI("top left", this.uiElements[0]);
      DM.setCornerUI("top right", this.uiElements[3]);
    }
  }
}

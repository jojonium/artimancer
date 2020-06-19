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

import { CANV_SIZE } from "./DisplayManager";
import { Manager } from "./Manager";
import { UIElement } from "./UIElement";

class UIManager extends Manager {
  /** singleton instance */
  private static _instance = new UIManager();
  /** stack of active UI elements, higher index drawn on top of lower index */
  private elements: UIElement[];
  /** UI elements that stick to the corners, drawn on top of others */
  private cornerUI: {
    tr: UIElement | undefined;
    br: UIElement | undefined;
    bl: UIElement | undefined;
    tl: UIElement | undefined;
  };
  /** whether to log extra info */
  private noisy = true;

  private constructor() {
    super();
    this.setType("UI Manager");

    this.cornerUI = {
      tr: undefined,
      br: undefined,
      bl: undefined,
      tl: undefined
    };

    this.elements = new Array<UIElement>();
  }

  /** get the singleton instance of this manager */
  public static getInstance(): UIManager {
    return UIManager._instance;
  }

  /** push a UI element to the top of the stack */
  public push(elt: UIElement): void {
    this.elements.push(elt);
  }

  /** pop the top UI element off the stack and return it */
  public pop(): UIElement | undefined {
    return this.elements.pop();
  }

  /**
   * Set the UI element to display in one of the corners
   * @param which which corner to set
   * @param uie a UI element
   */
  public setCornerUI(
    which: "top right" | "bottom right" | "bottom left" | "top left",
    uie: UIElement | undefined
  ): void {
    switch (which) {
      case "top right":
        this.cornerUI.tr = uie;
        return;
      case "bottom right":
        this.cornerUI.br = uie;
        return;
      case "bottom left":
        this.cornerUI.bl = uie;
        return;
      case "top left":
        this.cornerUI.tl = uie;
        return;
    }
  }

  /**
   * draws all UI elements
   * @param ctx canvas context to draw on
   * @param bcw back-canvas width
   * @param bch back-canvas height
   */
  public draw(ctx: CanvasRenderingContext2D, bcw: number, bch: number): void {
    for (const elt of this.elements) elt.draw(ctx);
    this.drawCorners(ctx, bcw, bch);
  }

  /**
   * draws corner UI elements
   * @param ctx canvas context to draw on
   * @param bcw back-canvas width
   * @param bch back-canvas height
   */
  private drawCorners(
    ctx: CanvasRenderingContext2D,
    bcw: number,
    bch: number
  ): void {
    // available "off-canvas" pixels that can still be seen, scaled to CANV_SIZE
    const verticalSpace = Math.max((bch - bcw) / 2, 0) * (CANV_SIZE / bcw);
    const horizontalSpace = Math.max((bcw - bch) / 2, 0) * (CANV_SIZE / bch);

    // top right
    if (this.cornerUI.tr !== undefined) {
      ctx.save();
      ctx.translate(
        CANV_SIZE -
          this.cornerUI.tr.getWidth() +
          Math.min(horizontalSpace, this.cornerUI.tr.getWidth()),
        -Math.min(verticalSpace, this.cornerUI.tr.getHeight())
      );
      this.cornerUI.tr.draw(ctx);
      ctx.restore();
    }

    // bottom right
    if (this.cornerUI.br !== undefined) {
      ctx.save();
      ctx.translate(
        CANV_SIZE -
          this.cornerUI.br.getWidth() +
          Math.min(horizontalSpace, this.cornerUI.br.getWidth()),
        CANV_SIZE -
          this.cornerUI.br.getHeight() +
          Math.min(verticalSpace, this.cornerUI.br.getHeight())
      );
      this.cornerUI.br.draw(ctx);
      ctx.restore();
    }

    // bottom left
    if (this.cornerUI.bl !== undefined) {
      ctx.save();
      ctx.translate(
        -Math.min(horizontalSpace, this.cornerUI.bl.getWidth()),
        CANV_SIZE -
          this.cornerUI.bl.getHeight() +
          Math.min(verticalSpace, this.cornerUI.bl.getHeight())
      );
      this.cornerUI.bl.draw(ctx);
      ctx.restore();
    }

    // top left
    if (this.cornerUI.tl !== undefined) {
      ctx.save();
      ctx.translate(
        -Math.min(horizontalSpace, this.cornerUI.tl.getWidth()),
        -Math.min(verticalSpace, this.cornerUI.tl.getHeight())
      );
      this.cornerUI.tl.draw(ctx);
      ctx.restore();
    }
  }

  /** step all UI elements */
  public step(): void {
    for (const elt of this.elements) elt.step();
    if (this.cornerUI.tr !== undefined) this.cornerUI.tr.step();
    if (this.cornerUI.br !== undefined) this.cornerUI.br.step();
    if (this.cornerUI.bl !== undefined) this.cornerUI.bl.step();
    if (this.cornerUI.tl !== undefined) this.cornerUI.tl.step();
  }

  /** starts up the UI Manager */
  public startUp(): void {
    super.startUp();
    if (this.noisy) console.log("UM: successfully started");
  }
}

export const UM = UIManager.getInstance();

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

import { Sprite } from "./Sprite";
import { Vector } from "./Vector";
import { roundedRect } from "./DisplayManager";

export enum UIElementAlignment {
  topLeft,
  topMiddle,
  topRight,
  centerLeft,
  centerMiddle,
  centerRight,
  bottomLeft,
  bottomMiddle,
  bottomRight
}

/**
 * This class represents a UI element, such as a text box or button prompt. UI
 * element are always drawn on top of the game world
 */
export class UIElement {
  /** unique string identifier */
  private label: string;
  /** how to draw this element */
  public style: UIElementStyle;
  /** how to align this element in its container */
  private alignment: UIElementAlignment;
  /** top left position of this element */
  private pos: Vector;
  /** height of this element. Set to 0 for auto */
  private height: number;
  /** width of this element. Set to 0 for auto */
  private width: number;
  /** text to display */
  private text: string;

  /**
   * @param label a unique string identifier for this UI Element
   */
  public constructor(label: string) {
    this.label = label;
    this.pos = new Vector(0, 0);
    this.height = 0;
    this.width = 0;
    this.style = {};
    this.alignment = UIElementAlignment.topLeft;
    this.text = "";
  }

  /**
   * draws this UI element
   * @param ctx canvas context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    // draw sprite
    if (this.style.bgSprite) {
      ctx.drawImage(
        this.style.bgSprite.getCurrentFrame().getImage(),
        this.pos.x,
        this.pos.y,
        this.width,
        this.height
      );
    }
    // draw background rectangle
    ctx.strokeStyle = this.style.borderStyle ?? "rgba(0, 0, 0, 0)";
    ctx.lineWidth = this.style.borderThickness ?? 0;
    ctx.fillStyle = this.style.fillStyle ?? "rgba(0, 0, 0, 0)";
    ctx.setLineDash(this.style.lineDash ?? []);
    roundedRect(
      ctx,
      this.pos,
      this.width,
      this.height,
      this.style.cornerRadius ?? 0
    );
    ctx.fill();
    ctx.stroke();
    // draw text
    ctx.font = this.style.font ?? "50px sans-serif";
    ctx.textAlign = this.style.textAlign ?? "center";
    ctx.textBaseline = this.style.textBaseline ?? "middle";
    ctx.fillStyle = this.style.fontFill ?? "rgba(0, 0, 0, 0)";
    const textVec = new Vector(
      this.pos.x + this.width / 2,
      this.pos.y + this.height / 2
    );
    switch (ctx.textAlign) {
      case "center":
        break;
      case "left":
        textVec.x = this.pos.x + (this.style.padding ?? 0);
        break;
      case "right":
        textVec.x = this.pos.x + this.width - (this.style.padding ?? 0);
        break;
    }
    // the JavaScript canvas API has no support for multi-line strings, so we'll
    // try to break on newlines manually
    const lines = this.text.split("\n");
    // there's no way to measure line height for some reason
    const lineHeight = this.style.lineHeight ?? 50;
    lines.forEach((line, i) => {
      ctx.fillText(
        line,
        textVec.x,
        textVec.y + i * lineHeight,
        this.width - (this.style.padding ?? 0) * 2
      );
    });
  }

  /**
   * get unique string identifier
   */
  public getLabel(): string {
    return this.label;
  }

  /**
   * get how this element is aligned
   */
  public getAlignment(): UIElementAlignment {
    return this.alignment;
  }

  /**
   * @param newAlignment how this element is aligned
   */
  public setAlignment(newAlignment: UIElementAlignment): void {
    this.alignment = newAlignment;
  }

  /**
   * get top-left position of this element
   */
  public getPos(): Vector {
    return this.pos;
  }

  /**
   * @param newPos new top-left position of this element
   */
  public setPos(newPos: Vector): void {
    this.pos = newPos;
  }

  public getWidth(): number {
    return this.width;
  }

  /**
   * @param newWidth width of this element. Set to 0 for auto
   */
  public setWidth(newWidth: number): void {
    this.width = newWidth;
  }

  public getHeight(): number {
    return this.height;
  }

  /**
   * @param newHeight height of this element. Set to 0 for auto
   */
  public setHeight(newHeight: number): void {
    this.height = newHeight;
  }

  public getText(): string {
    return this.text;
  }

  /**
   * @param newText text to display
   */
  public setText(newText: string): void {
    this.text = newText;
  }
}

/**
 * A set of style information specifying how to draw this UI element
 */
export type UIElementStyle = {
  /** drawn below other attributes */
  bgSprite?: Sprite;
  borderThickness?: number;
  borderStyle?: string | CanvasGradient | CanvasPattern;
  fillStyle?: string | CanvasGradient | CanvasPattern;
  font?: string;
  fontFill?: string | CanvasGradient | CanvasPattern;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  padding?: number;
  cornerRadius?: number;
  lineDash?: number[];
  lineHeight?: number;
};

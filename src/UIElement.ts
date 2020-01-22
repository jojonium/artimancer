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
  /** position of this element */
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
    // TODO implement
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
    ctx.font = this.style.fontStyle ?? "50px sans-serif";
    ctx.textAlign = this.style.textAlign ?? "center";
    ctx.textBaseline = this.style.textBaseline ?? "alphabetic";
    ctx.fillStyle = this.style.fontStyle ?? "rgba(0, 0, 0, 0)";
    const textVec = new Vector(this.width / 2, this.height / 2);
    ctx.fillText(
      this.text,
      textVec.x,
      textVec.y,
      this.width - (this.style.padding ?? 0) * 2
    );
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
   * get position of this element
   */
  public getPos(): Vector {
    return this.pos;
  }

  /**
   * @param newPos new position of this element
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

export type UIElementStyle = {
  /** drawn below other attributes */
  bgSprite?: Sprite;
  borderThickness?: number;
  borderStyle?: string | CanvasGradient | CanvasPattern;
  fillStyle?: string | CanvasGradient | CanvasPattern;
  fontStyle?: string;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  padding?: number;
  cornerRadius?: number;
};

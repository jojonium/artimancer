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
import { Box } from "./Box";
import { RM } from "./ResourceManager";

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
  /** text to display */
  private text: string;
  /** bounding box of this element in its parent */
  protected box: Box;
  /** whether or not this element can be clicked */
  protected onClick: () => void;

  /**
   * @param label a unique string identifier for this UI Element
   */
  public constructor(label: string, box: Box) {
    this.box = box;
    this.onClick = (): void => {
      return;
    };
    this.label = label;
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
        this.box.topLeft.x,
        this.box.topLeft.y,
        this.box.width,
        this.box.height
      );
    }
    // draw background rectangle
    ctx.strokeStyle = this.style.borderStyle ?? "rgba(0, 0, 0, 0)";
    ctx.lineWidth = this.style.borderThickness ?? 0;
    ctx.fillStyle = this.style.fillStyle ?? "rgba(0, 0, 0, 0)";
    ctx.setLineDash(this.style.lineDash ?? []);
    roundedRect(
      ctx,
      this.box.topLeft,
      this.box.width,
      this.box.height,
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
      this.box.topLeft.x + this.box.width / 2,
      this.box.topLeft.y + this.box.height / 2
    );
    switch (ctx.textAlign) {
      case "center":
        break;
      case "left":
        textVec.x = this.box.topLeft.x + (this.style.padding ?? 0);
        break;
      case "right":
        textVec.x =
          this.box.topLeft.x + this.box.width - (this.style.padding ?? 0);
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
        this.box.width - (this.style.padding ?? 0) * 2
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
    return this.box.topLeft;
  }

  /**
   * @param newPos new top-left position of this element
   */
  public setPos(newPos: Vector): void {
    this.box.topLeft = newPos;
  }

  public getWidth(): number {
    return this.box.width;
  }

  /**
   * @param newWidth width of this element. Set to 0 for auto
   */
  public setWidth(newWidth: number): void {
    this.box.width = newWidth;
  }

  public getHeight(): number {
    return this.box.height;
  }

  /**
   * @param newHeight height of this element. Set to 0 for auto
   */
  public setHeight(newHeight: number): void {
    this.box.height = newHeight;
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

  /**
   * Set the background sprite of this element. Throws an error if it can't get
   * the sprite from the ResourceManager
   * @param spriteLabel the string label of the sprite to set
   */
  public setSprite(spriteLabel: string): void {
    const s = RM.getSprite(spriteLabel);
    if (s === undefined) throw new Error("Couldn't get sprite " + spriteLabel);
    this.style.bgSprite = s;
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

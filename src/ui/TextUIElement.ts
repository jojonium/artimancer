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

import { Box } from "../Box";
import { UIElement } from "../UIElement";
import { Vector } from "../Vector";

/**
 * A UI element that displays text with minimal formatting.
 * This should only be used for testing.
 */
export class TextUIElement extends UIElement {
  private text: string;
  public style: TextUIElementStyle = {};

  public constructor(label: string, box: Box, text = "") {
    super(label, box);
    this.text = text;
  }

  public setText(newText: string) {
    this.text = newText;
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    ctx.font = this.style.font ?? "20px sans-serif";
    ctx.textAlign = this.style.textAlign ?? "left";
    ctx.textBaseline = this.style.textBaseline ?? "middle";
    ctx.fillStyle = this.style.fontFill ?? "rgba(255, 255, 255, 1)";
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
}

export type TextUIElementStyle = {
  font?: string;
  fontFill?: string | CanvasGradient | CanvasPattern;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  padding?: number;
  lineHeight?: number;
};

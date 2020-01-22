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

import { FontFaceDescriptors } from "css-font-loading-module";

/**
 * List all resources to load here
 */
export const resources = {
  sprites: [
    { spriteLabel: "test", length: 6, slowdown: 48 },
    { spriteLabel: "test-bg", length: 1, slowdown: 0 },
    { spriteLabel: "edit-menu-move", length: 1, slowdown: 0 },
    { spriteLabel: "edit-menu-barrier", length: 1, slowdown: 0 }
  ],
  images: [
    { filename: "images/f1.svg", spriteLabel: "test", index: 0 },
    { filename: "images/f2.svg", spriteLabel: "test", index: 1 },
    { filename: "images/f3.svg", spriteLabel: "test", index: 2 },
    { filename: "images/f4.svg", spriteLabel: "test", index: 3 },
    { filename: "images/f5.svg", spriteLabel: "test", index: 4 },
    { filename: "images/f6.svg", spriteLabel: "test", index: 5 },
    { filename: "images/test-bg.svg", spriteLabel: "test-bg", index: 0 },
    {
      filename: "images/edit-menu-move.svg",
      spriteLabel: "edit-menu-move",
      index: 0
    },
    {
      filename: "images/edit-menu-barrier.svg",
      spriteLabel: "edit-menu-barrier",
      index: 0
    }
  ],
  fonts: [
    {
      family: "Bitter",
      filename: "fonts/bitter/Bitter-Regular.otf",
      options: { style: "normal", weight: "400" } as FontFaceDescriptors
    },
    {
      family: "Bitter",
      filename: "fonts/bitter/Bitter-Bold.otf",
      options: { style: "normal", weight: "700" } as FontFaceDescriptors
    },
    {
      family: "Bitter",
      filename: "fonts/bitter/Bitter-Italic.otf",
      options: { style: "italic", weight: "400" } as FontFaceDescriptors
    },
    {
      family: "Bitter",
      filename: "fonts/bitter/Bitter-BoldItalic.otf",
      options: { style: "italic", weight: "700" } as FontFaceDescriptors
    }
  ]
};

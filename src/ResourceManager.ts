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

import { Manager } from "./Manager";
import { Frame, Sprite } from "./Sprite";
import { resources } from "./resources";
import { FontFaceDescriptors } from "css-font-loading-module";

/**
 * The ResourceManager handles loading resources, such as sprites and sounds
 */
export class ResourceManager extends Manager {
  /** singleton instance */
  private static _instance = new ResourceManager();
  /** map of sprites, indexed by name */
  private sprites: Map<string, Sprite>;
  /** what percentage of all resources have loaded */
  private percentLoaded: number;
  /** whether to log extra info */
  private noisy = true;

  /**
   * Private because ResourceManager is a singleton
   */
  private constructor() {
    super();
    this.setType("Resource Manager");
    this.sprites = new Map<string, Sprite>();
    this.percentLoaded = 0;
  }

  /**
   * Return the singleton instance of this class
   */
  public static getInstance(): ResourceManager {
    return ResourceManager._instance;
  }

  /**
   * Initialize this manager
   */
  public startUp(): void {
    this.sprites = new Map<string, Sprite>();

    this.loadAllResources();

    super.startUp();
    if (this.noisy) console.log("RM: successfully started");
  }

  private loadAllResources(): void {
    // set up sprites
    for (const s of resources.sprites) {
      this.sprites.set(s.spriteLabel, new Sprite(s.slowdown, s.length));
    }
    this.percentLoaded = 0;
    // TODO update this when more things are added to resources
    const totalLength = resources.images.length + resources.fonts.length;

    // load all fonts
    for (const f of resources.fonts) {
      this.loadFont(f.family, f.filename, f.options)
        .then(ff => {
          if (this.noisy) console.log(`RM: successfully loaded ${f.filename}`);
          document.fonts.add(ff);
          this.percentLoaded += 1 / totalLength;
        })
        .catch(reason => {
          console.error(reason);
          throw new Error(`RM: failed to load font ${f.filename}`);
        });
    }
    // load all images
    for (const i of resources.images) {
      // make sure this sprite exists
      if (!this.sprites.has(i.spriteLabel)) {
        throw new Error("RM: missing sprite with label " + i.spriteLabel);
      }
      this.loadImage(i.filename)
        .then(
          img => {
            if (this.noisy)
              console.log(`RM: successfully loaded ${i.filename}`);
            const frame = new Frame(img);
            const spr = this.sprites.get(i.spriteLabel);
            if (spr !== null && spr !== undefined) {
              spr.setFrame(i.index, frame);
              this.percentLoaded += 1 / totalLength;
            }
          },
          reason => {
            console.error(reason);
            throw new Error(`RM: failed to load image ${i.filename}`);
          }
        )
        .catch(reason => {
          console.error(reason);
          throw new Error(`RM: failed to load image ${i.filename}`);
        });
    }
  }

  /**
   * Loads a font from the server
   * @param family name of this font family
   * @param filename filename of the font to load
   * @param ffDesc CSS font-face descriptors to go with this font
   * @return a Promise containing the FontFace
   */
  private loadFont(
    family: string,
    filename: string,
    ffDesc?: FontFaceDescriptors
  ): Promise<FontFace> {
    const ff = new FontFace(family, `url(${filename})`, ffDesc);
    return ff.load();
  }

  /**
   * Loads an image from the server
   * @param filename file name of the image to load
   * @return a promise containing the image. Rejects if there's an error
   * loading the image
   */
  private loadImage(filename: string): Promise<HTMLImageElement> {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.src = filename;
      img.onload = (): void => {
        resolve(img);
      };
      img.onerror = (): void => {
        const reason = `RM: failed to load image ${filename}`;
        if (this.noisy) console.error(reason);
        reject(reason);
      };
    });
  }

  /**
   * Gets a particular sprite
   * @param label name of the sprite to get
   */
  public getSprite(label: string): Sprite | undefined {
    return this.sprites.get(label);
  }

  public getPercentLoaded(): number {
    return this.percentLoaded;
  }
}

export const RM = ResourceManager.getInstance();

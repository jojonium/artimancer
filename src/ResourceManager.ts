import { Manager } from "./Manager";
import { Sprite } from "./Sprite";
import { resources } from "./resources";
import { Frame } from "./Frame";

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
    if (this.noisy) console.log("Resource Manager successfully started");
  }

  private loadAllResources(): void {
    // set up sprites
    for (const s of resources.sprites) {
      this.sprites.set(s.spriteLabel, new Sprite(s.slowdown, s.length));
    }
    this.percentLoaded = 0;
    // TODO update this when more things are added to resources
    const totalLength = resources.images.length;
    for (const i of resources.images) {
      // make sure this sprite exists
      if (!this.sprites.has(i.spriteLabel)) {
        throw new Error("RM: missing sprite with label " + i.spriteLabel);
      }
      this.loadImage(i.filename).then(
        img => {
          if (this.noisy) console.log(`RM: successfully loaded ${i.filename}`);
          const frame = new Frame(img);
          this.sprites.get(i.spriteLabel).setFrame(i.index, frame);
          this.percentLoaded += 1 / totalLength;
          // round percentLoaded to the nearest hundredth
          this.percentLoaded = Math.round(this.percentLoaded * 100) / 100;
        },
        reason => {
          throw new Error(`RM: failed to load: ${reason}`);
        }
      );
    }
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
  public getSprite(label: string): Sprite {
    return this.sprites.get(label);
  }

  public getPercentLoaded(): number {
    return this.percentLoaded;
  }
}

export const RM = ResourceManager.getInstance();

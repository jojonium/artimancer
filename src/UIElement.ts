import { Sprite } from "./Sprite";
import { Vector } from "./Vector";

/**
 * This class represents a UI element, such as a text box or button prompt. UI
 * element are always drawn on top of the game world
 */
export class UIElement {
  /** unique string identifier */
  private label: string;
  /** sub-elements contained within this one */
  private children: UIElement[];
  /** how to draw this element */
  private style: UIElementStyle;
  /** how to align this element in its container */
  private alignment: UIElementAlignment;
  /** position of this element relative to its parent */
  private pos: Vector;
  /** height of this element. Set to 0 for auto */
  private height: number;
  /** width of this element. Set to 0 for auto */
  private width: number;

  /**
   * @param label a unique string identifier for this UI Element
   */
  public constructor(label: string) {
    this.label = label;
    this.children = new Array<UIElement>();
    this.pos = new Vector(0, 0);
    this.height = 0;
    this.width = 0;
  }

  /**
   * appends a new child element that inherits all attributes from this one
   * @param childLabel label for the child UIElement
   */
  public addChild(childLabel: string): void {
    const child = new UIElement(childLabel);
    child.setAlignment(this.alignment);
    child.setStyle(this.style);
    child.setPos(this.pos);
    this.children.push(child);
  }

  /**
   * get unique string identifier
   */
  public getLabel(): string {
    return this.label;
  }

  /**
   * Get attributes for drawing this element
   */
  public getStyle(): UIElementStyle {
    return this.style;
  }

  /**
   * @param newStyle new attributes for drawing this element
   */
  public setStyle(newStyle: UIElementStyle): void {
    this.style = newStyle;
  }

  /**
   * get how this element is aligned in its parent
   */
  public getAlignment(): UIElementAlignment {
    return this.alignment;
  }

  /**
   * @param newAlignment how this element is aligned in its parent
   */
  public setAlignment(newAlignment: UIElementAlignment): void {
    this.alignment = newAlignment;
  }

  /**
   * get position of this element relative to its parent
   */
  public getPos(): Vector {
    return this.pos;
  }

  /**
   * @param newPos new position of this element relative to its parent
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
}

export type UIElementStyle = {
  /** drawn below other attributes */
  bgSprite?: Sprite;
  borderThickness?: number;
  borderStyle?: string | CanvasGradient | CanvasPattern;
  fillStyle?: string | CanvasGradient | CanvasPattern;
  fontStyle?: string;
  textAlign?: CanvasTextAlign;
  textBaselint?: CanvasTextBaseline;
  padding?: number;
};

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

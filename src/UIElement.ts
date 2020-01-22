import { Sprite } from "./Sprite";
import { Vector } from "./Vector";
import { roundedRect } from "./DisplayManager";

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
  public style: UIElementStyle;
  /** how to align this element in its container */
  private alignment: UIElementAlignment;
  /** position of this element relative to its parent */
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
    child.style = this.style;
    child.setPos(this.pos);
    this.children.push(child);
  }

  /**
   * recursively finds how wide this should be based on the widths of its
   * children
   */
  private calculateWidth(): number {
    if (this.children.length === 0 || this.width !== 0) {
      return this.width + this.style.padding * 2;
    }
    if (this.style.layout === "row") {
      // find total width of this and its children
      return this.children.reduce<number>(
        (accum, child) => accum + child.calculateWidth(),
        this.style.padding * 2
      );
    } else {
      // find max width of this elements children
      return (
        Math.max(...this.children.map(child => child.calculateWidth())) +
        this.style.padding * 2
      );
    }
  }

  /**
   * recursively finds how tall this should be based on the heights of its
   * children
   */
  private calculateHeight(): number {
    if (this.children.length === 0 || this.height !== 0) {
      return this.height + this.style.padding * 2;
    }
    if (this.style.layout === "column") {
      // find total height of this and its children
      return this.children.reduce<number>(
        (accum, child) => accum + child.calculateHeight(),
        this.style.padding * 2
      );
    } else {
      // find max height of this elements children
      return (
        Math.max(...this.children.map(child => child.calculateHeight())) +
        this.style.padding * 2
      );
    }
  }

  /**
   * draws this UI element and all its children
   * @param ctx canvas context to draw on
   */
  public draw(ctx: CanvasRenderingContext2D): void {
    // TODO implement
  }

  /**
   * get unique string identifier
   */
  public getLabel(): string {
    return this.label;
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
  textBaselint?: CanvasTextBaseline;
  padding?: number;
  cornerRadius?: number;
  layout?: "column" | "row";
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

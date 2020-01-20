/**
 * One frame of a sprite, consisting of an SVG image
 */
export class Frame {
  /** width of this frame in pixels */
  private width: number;
  /** height of this frame in pixels */
  private height: number;
  /** Image for this frame */
  private img: HTMLImageElement;

  public constructor(img: HTMLImageElement) {
    this.img = img;
  }

  public getImage(): HTMLImageElement {
    return this.img;
  }
}

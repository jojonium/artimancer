/**
 * Clock class used for timing game steps
 */
export class Clock {
  private previousTime: number; // previous time reading, in milliseconds

  /**
   * Initializes previousTime to the current time
   */
  public constructor() {
    // window.performance.now() uses the High Resolution Time API, and is much
    // more accurate than Date.getTime(). See <https://www.w3.org/TR/hr-time/>
    // for details
    this.previousTime = window.performance.now();
  }

  /**
   * returns time elapsed in milliseconds since delta() was last called and
   * resets clock time.
   *
   */
  public delta(): number {
    const afterTime = window.performance.now();
    const elapsed = afterTime - this.previousTime;
    this.previousTime = afterTime;
    return elapsed;
  }

  /**
   * returns time elapsed in milliseconds since delta() was last called and
   * does NOT reset clock time
   */
  public split(): number {
    return window.performance.now() - this.previousTime;
  }
}

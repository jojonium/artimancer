/**
 * Manager super-class that other Managers inherit from
 */
export class Manager {
  private isStarted: boolean; // true if this manager has started
  private type: string; // type identifier

  public constructor() {
    this.isStarted = false;
    this.setType("Manager");
  }

  /**
   * Starts up this manager. Throws an error if something goes wrong
   */
  public startUp(): void {
    this.isStarted = true;
  }

  /**
   * @param newType new type identifier for this manager
   */
  protected setType(newType: string): void {
    this.type = newType;
  }
}

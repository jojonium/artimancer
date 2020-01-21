import { Manager } from "./Manager";
import { Vector } from "./Vector";

/**
 * Represents the status of a button
 */
class Status {
  /** if the key is currently down */
  public isDown: boolean;
  /** if the key was down last step */
  public wasDown: boolean;
  /** if the key is currently down and was up last step (i.e. just pressed) */
  public isPressed: boolean;
  /** if the key is currently down and was down last step (i.e. being held) */
  public isHeld: boolean;
  /** if the key is currently up, and was down last step (i.e. just released) */
  public isReleased: boolean;

  /**
   * Initializes all values to false
   */
  public constructor() {
    this.isDown = false;
    this.wasDown = false;
    this.isPressed = false;
    this.isHeld = false;
    this.isReleased = false;
  }
}

/**
 * Represents a classic button, mapping to both a keyboard key and a gamepad
 * button
 */
class Button {
  public key: string;
  public readonly status: Status;
  public gpButtonIndex: number;
  public onPressed: () => void;
  public onReleased: () => void;

  /**
   * Constructs a new button combining a keyboard key and joystick button
   * @param key KeyboardEvent.key value of the keyboard key for this button
   * @param gpButtonIndex index of this gamepad button in gamepad.buttons
   */
  public constructor(key: string, gpButtonIndex?: number) {
    this.key = key;
    this.gpButtonIndex = gpButtonIndex;
    this.status = new Status();
  }
}

/**
 * Represents a directional, mapping to four keyboard keys and a gamepad
 * joystick
 */
class Directional {
  public upButton: Button;
  public rightButton: Button;
  public downButton: Button;
  public leftButton: Button;
  public hAxisIndex: number;
  public vAxisIndex: number;
  public vec: Vector;

  /**
   * Constructs a new Directional including a set of four buttons and a joystick
   * @param upKey KeyboardEvent.key value of the keyboard key for going up
   * @param rightKey KeyboardEvent.key value of the keyboard key for going right
   * @param downKey KeyboardEvent.key value of the keyboard key for going down
   * @param leftKey KeyboardEvent.key value of the keyboard key for going left
   * @param hAxisIndex index of our vertical axis in gamepad.axes
   * @param vAxisIndex index of our horizontal axis in gamepad.axes
   */
  public constructor(
    upKey: string,
    rightKey: string,
    downKey: string,
    leftKey: string,
    hAxisIndex?: number,
    vAxisIndex?: number
  ) {
    this.upButton = new Button(upKey);
    this.rightButton = new Button(rightKey);
    this.downButton = new Button(downKey);
    this.leftButton = new Button(leftKey);
    this.hAxisIndex = hAxisIndex;
    this.vAxisIndex = vAxisIndex;
    this.vec = new Vector(0, 0);
  }

  /**
   * Sets this vec based on what buttons are being pressed
   */
  public setVecFromButtons(): void {
    this.vec = new Vector(0, 0);
    if (this.leftButton.status.isDown) this.vec.x -= 1;
    if (this.rightButton.status.isDown) this.vec.x += 1;
    if (this.upButton.status.isDown) this.vec.y -= 1;
    if (this.downButton.status.isDown) this.vec.y += 1;
    this.vec = this.vec.normalize();
  }

  /**
   * Returns this Directionals buttons in order: up, right, down, left
   */
  public getButtons(): Button[] {
    return [this.upButton, this.rightButton, this.downButton, this.leftButton];
  }
}

/**
 * The InputManager class deals with getting input from the keyboard and
 * controllers, abstracting them into an 'input' object that is updated every
 * step
 */
class InputManager extends Manager {
  /** Singleton instance of this manager */
  private static _instance = new InputManager();
  /** Map of directionals, each with a name */
  private directionals: Map<string, Directional>;
  /** Map of buttons, each with a name */
  private buttons: Map<string, Button>;
  /** true if we're using the keyboard for controls, false for controller */
  private usingKeyboard: boolean;
  /** ignore central area of sticks */
  private deadzone = 0.2;
  /** multiplier for stick reading */
  private stickSensitivity = 1.4;
  /** whether to log extra information */
  private noisy = true;

  /**
   * Private because managers are supposed to be singleton
   */
  private constructor() {
    super();
    this.setType("Input Manager");
  }

  /**
   * @return the singleton instance of this manager
   */
  public static getInstance(): InputManager {
    return InputManager._instance;
  }

  /**
   * Returns an array of all buttons, including the keys of directionals
   */
  private getAllButtons(): Button[] {
    const out = new Array<Button>();
    this.buttons.forEach(but => out.push(but));
    this.directionals.forEach(dir => out.concat(dir.getButtons()));
    return out;
  }

  /**
   * Lets buttons know that a game step has passed
   */
  private ageButtons(): void {
    for (const b of this.getAllButtons()) {
      // assume no change
      b.status.wasDown = b.status.isDown;
      b.status.isReleased = false;
      b.status.isHeld = b.status.isDown;
      b.status.isPressed = false;
    }
  }

  /**
   * Call this when a button has just been pressed
   * @param button the button that has just been pressed
   */
  private buttonDown(button: Button): void {
    button.status.isDown = true;
    button.status.isHeld = button.status.wasDown;
    button.status.isPressed = !button.status.wasDown;
    button.status.isReleased = false;
  }

  /**
   * Call this when a button has just been released
   * @param button the button that has just been released
   */
  private buttonUp(button: Button): void {
    button.status.isDown = false;
    button.status.isHeld = false;
    button.status.isPressed = false;
    button.status.isReleased = button.status.wasDown;
  }

  /**
   * Call this for each button each step before ageButton() *if* usingKeyboard
   * is false
   * @param button a button
   * @param currentlyDown whether that button is currently down
   */
  private buttonStep(button: Button, currentlyDown = false): void {
    button.status.isDown = currentlyDown;
    button.status.isHeld = currentlyDown && button.status.wasDown;
    button.status.isPressed = currentlyDown && !button.status.wasDown;
    button.status.isReleased = !currentlyDown && button.status.wasDown;
  }

  /**
   * This should be called every step to update buttons with input from any
   * connected controllers
   */
  private getGamepadInput(): void {
    const deadZoneGuard = (x: number): number =>
      Math.abs(x) > this.deadzone ? x : 0;

    for (const gamepad of navigator.getGamepads()) {
      if (!gamepad || !gamepad.connected) {
        // skip disconnected gamepads
        continue;
      }
      // check if any of the sticks we care about are pressed
      this.directionals.forEach(dir => {
        const xai = dir.hAxisIndex;
        const yai = dir.vAxisIndex;
        if (xai !== undefined && gamepad.axes[xai]) {
          const reading = deadZoneGuard(gamepad.axes[xai]);
          if (reading !== 0) this.usingKeyboard = false;
        }
        if (yai !== undefined && gamepad.axes[yai]) {
          const reading = deadZoneGuard(gamepad.axes[yai]);
          if (reading !== 0) this.usingKeyboard = false;
        }
      });

      // check if any of the buttons we care about are pressed
      this.buttons.forEach(but => {
        const bi = but.gpButtonIndex;
        if (bi !== undefined && gamepad.buttons[bi]) {
          if (gamepad.buttons[bi].value > 0 || gamepad.buttons[bi].pressed) {
            this.usingKeyboard = false;
          }
        }
      });

      // now, if we're not using the keyboard actually get the values from the
      // controller and assign them to buttons
      if (!this.usingKeyboard) {
        // get values from sticks
        this.directionals.forEach(dir => {
          const xai = dir.hAxisIndex;
          const yai = dir.vAxisIndex;
          let xReading = 0;
          let yReading = 0;
          if (xai !== undefined && gamepad.axes[xai]) {
            xReading = deadZoneGuard(gamepad.axes[xai]);
          }
          if (yai !== undefined && gamepad.axes[yai]) {
            yReading = deadZoneGuard(gamepad.axes[yai]);
          }
          dir.vec = new Vector(xReading, yReading).multiply(
            this.stickSensitivity
          );
          if (dir.vec.getMagnitude() > 1) dir.vec = dir.vec.normalize();
        });

        // get values from buttons
        this.buttons.forEach(but => {
          const bi = but.gpButtonIndex;
          if (bi !== undefined && gamepad.buttons[bi]) {
            this.buttonStep(
              but,
              gamepad.buttons[bi].value > 0 || gamepad.buttons[bi].pressed
            );
          }
        });
      }
    }
  }

  /**
   * handler for keydown events
   * @param e the KeyboardEvent generated by the key press
   */
  private keydownHandler(e: KeyboardEvent): void {
    this.usingKeyboard = true;
    const key = e.key;

    // is it a stick button?
    this.directionals.forEach(dir => {
      for (const db of dir.getButtons()) {
        if (key === db.key) {
          e.preventDefault();
          this.buttonDown(db);
          dir.setVecFromButtons();
        }
      }
    });

    // is it a normal button?
    this.buttons.forEach(but => {
      if (key === but.key) {
        e.preventDefault();
        this.buttonDown(but);
      }
    });
  }

  /**
   * handler for keyup events
   * @param e the KeyboardEvent generated by the key release
   */
  private keyupHandler(e: KeyboardEvent): void {
    this.usingKeyboard = true;
    const key = e.key;

    // is it a stick button?
    this.directionals.forEach(dir => {
      for (const db of dir.getButtons()) {
        if (key === db.key) {
          e.preventDefault();
          this.buttonUp(db);
          dir.setVecFromButtons();
        }
      }
    });

    // is it a normal button?
    this.buttons.forEach(but => {
      if (key === but.key) {
        e.preventDefault();
        this.buttonUp(but);
      }
    });
  }

  /**
   * handles gamepadconnect events
   * @param e the GamepadEvent created by the event
   */
  private gamepadconnectHandler(e: GamepadEvent): void {
    if (this.noisy) console.log("gamepad connected: " + e.gamepad.index);
    this.usingKeyboard = false;
  }

  /**
   * handles gamepaddisconnect events
   * @param e the GamepadEvent created by the event
   */
  private gamepaddisconnectHandler(e: GamepadEvent): void {
    if (this.noisy) console.log("gamepad disconnected: " + e.gamepad.index);
    this.usingKeyboard = true;
  }

  /**
   * Removes, then sets all event listeners for keyboard keys
   */
  private resetListeners(): void {
    // set listeners
    document.removeEventListener("keydown", this.keydownHandler.bind(this));
    document.removeEventListener("keyup", this.keyupHandler.bind(this));
    window.removeEventListener(
      "gamepadconnected",
      this.gamepadconnectHandler.bind(this)
    );
    window.removeEventListener(
      "gamepaddisconnected",
      this.gamepaddisconnectHandler.bind(this)
    );
    document.addEventListener("keydown", this.keydownHandler.bind(this));
    document.addEventListener("keyup", this.keyupHandler.bind(this));
    window.addEventListener(
      "gamepadconnected",
      this.gamepadconnectHandler.bind(this)
    );
    window.addEventListener(
      "gamepaddisconnected",
      this.gamepaddisconnectHandler.bind(this)
    );
    if (this.noisy) console.log("IM: listeners set");
  }

  /**
   * Should be called each game step to get input
   */
  public step(): void {
    this.getGamepadInput();
    // do all onPressed and onReleased functions for all buttons
    for (const b of this.getAllButtons()) {
      if (b.status.isPressed && b.onPressed) b.onPressed();
      if (b.status.isReleased && b.onReleased) b.onReleased();
    }
    this.ageButtons();
  }

  /**
   * registers a new button with a particular name. Will overwrite previous one
   * with the same name
   * @param name name of this button
   * @param key KeyboardEvent.key associated with this button
   * @param gpButtonIndex gamepad.buttons index associated with this button
   */
  public registerButton(
    name: string,
    key: string,
    gpButtonIndex?: number
  ): void {
    this.buttons.set(name, new Button(key, gpButtonIndex));
  }

  /**
   * Sets a function to execute when a button is pressed
   * @param name name of the button
   * @param handler function to execute when button is pressed
   * @return true if successfully set, false if the name doesn't exist
   */
  public setOnPressed(name: string, handler: () => void): boolean {
    if (this.buttons.has(name)) {
      this.buttons.get(name).onPressed = handler;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Sets a function to execute when a button is released
   * @param name name of the button
   * @param handler function to execute when button is released
   * @return true if successfully set, false if the name doesn't exist
   */
  public setOnReleased(name: string, handler: () => void): boolean {
    if (this.buttons.has(name)) {
      this.buttons.get(name).onReleased = handler;
      return true;
    } else {
      return false;
    }
  }

  /**
   * Registers a new directional with a given name, overwriting any existing
   * directional with the same name
   * @param upKey KeyboardEvent.key value of the keyboard key for going up
   * @param rightKey KeyboardEvent.key value of the keyboard key for going right
   * @param downKey KeyboardEvent.key value of the keyboard key for going down
   * @param leftKey KeyboardEvent.key value of the keyboard key for going left
   * @param hAxisIndex index of our vertical axis in gamepad.axes
   * @param vAxisIndex index of our horizontal axis in gamepad.axes
   */
  public registerDirectional(
    name: string,
    upKey: string,
    rightKey: string,
    downKey: string,
    leftKey: string,
    hAxisIndex?: number,
    vAxisIndex?: number
  ): void {
    this.directionals.set(
      name,
      new Directional(upKey, rightKey, downKey, leftKey, hAxisIndex, vAxisIndex)
    );
  }

  /**
   * Unregister all buttons and directionals
   */
  public unregisterAll(): void {
    this.buttons = new Map<string, Button>();
    this.directionals = new Map<string, Directional>();
  }

  /**
   * Starts up this manager, setting event listeners
   */
  public startUp(): void {
    super.startUp();

    // initialize values
    this.unregisterAll();
    this.usingKeyboard = true;

    // set listeners
    this.resetListeners();

    if (this.noisy) console.log("IM: successfully started");
  }
}

export const IM = InputManager.getInstance();

import { GM } from "./GameManager";
import { IM } from "./InputManager";
import { DM } from "./DisplayManager";

function main(): void {
  // start all managers
  GM.startUp();

  // set default buttons
  IM.registerButton("primary", " ", 0);
  IM.registerButton("secondary", "e", 1);
  IM.registerButton("fullscreen", "f", 8);
  IM.registerButton("escape", "Escape", 9);
  IM.setOnPressed("fullscreen", DM.toggleFullScreen.bind(DM));
  IM.registerDirectional("move", "w", "d", "s", "a", 1, 0);
}

window.onload = main;

import { GM } from "./GameManager";
import { DM } from "./DisplayManager";

function main(): void {
  // start all managers
  GM.startUp();

  // TODO move this into InputManager
  document.addEventListener("keydown", e => {
    const key = e.key;
    if (key === "f") {
      DM.enterFullscreen();
    }
  });
}

window.onload = main;

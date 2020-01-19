import { GM } from "./GameManager";
import { DM } from "./DisplayManager";

function main(): void {
  // start all managers
  GM.startUp();

  document.addEventListener("keydown", e => {
    const key = e.key;
    if (key === "f") {
      DM.enterFullscreen();
    }
  });

  document.addEventListener("fullscreenchange", () => {
    DM.onExitFullscreen();
  });
}

window.onload = main;

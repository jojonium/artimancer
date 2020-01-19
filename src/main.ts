import { GM } from "./GameManager";

function main(): void {
  // start all managers
  GM.startUp();
}

window.onload = main;

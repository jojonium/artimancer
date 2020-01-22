/**
 * Copyright (C) 2020 Joseph Petitti
 *
 * This file is part of Artimancer, a simple turn-based RPG for the web.
 *
 * Artimancer is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * Artimancer is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * Artimancer. If not, see <https://www.gnu.org/licenses/>.
 */

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
  IM.registerButton("escape", "Tab", 9);
  IM.registerButton("delete", "Delete");
  IM.setOnPressed("fullscreen", DM.toggleFullScreen.bind(DM));
  IM.registerDirectional("move", "w", "d", "s", "a", 1, 0);
}

window.onload = main;

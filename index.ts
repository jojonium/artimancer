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

import * as express from "express";
import { resolve } from "path";
const app = express();

// get port and hostname from environment variables, or use defaults if not set
const PORT = process.env.NODE_PORT ?? "3000";
const HOSTNAME = process.env.NODE_HOSTNAME ?? "localhost";

// directory to serve static content from
app.use(express.static(resolve(__dirname, "static")));

// serve images from the images directory
app.use("/images", express.static(resolve(__dirname, "images")));

// serve fonts from the fonts directory
app.use("/fonts", express.static(resolve(__dirname, "fonts")));

// start the server
app.listen(+PORT, HOSTNAME, () => {
  console.log(`Started server listening on ${HOSTNAME}:${PORT}...`);
});

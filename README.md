# Unnamed Turn-Based RPG

A simple game I'm working on. Stay tuned for more progress.

## Running Development Server

```
$ npm ci
$ npm run build
$ npm start
```

The `build` npm script will compile TypeScript in the `src` directory, and write
the output to `dist`. Then Browserify will bundle all the transpiled files into
one `static/bundle.js`. 

The `npm run watch` script will start the web server and watch for source
file changes, automatically re-compiling when changes are detected

## Formatting and Linting

ESlint and Prettier are configured already. Just do `npm run lint` to lint your
TypeScript.

## Copying

This program is free software: you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any
later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.  See the GNU General Public License for more details.

See LICENSE.txt for a copy of the GNU General Public License, or visit
<https://www.gnu.org/licenses/>.

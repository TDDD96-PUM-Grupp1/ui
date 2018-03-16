// import * as PIXI from 'pixi.js';
import EntityHandler from './EntityHandler';
import TestGamemode from './gamemodes/TestGamemode';

/* eslint-disable */
var GAME;
/* eslint-enable */

/*
Game.
*/
class Game {
  constructor(app) {
    this.app = app;

    // Set global variables for the pixi context and game context to heavily simplify
    // the creation of additional objects and graphics when necessary.
    GAME = this;

    // Create all handlers
    this.entityHandler = new EntityHandler();

    // Create gamemode
    this.currentGamemode = new TestGamemode(this);
  }

  // Main game loop
  loop(delta) {
    // Convert frame delta to time delta [second] (assuming 60fps)
    const dt = delta / 60;

    // Update object handler
    this.currentGamemode.preUpdate(dt);
    this.entityHandler.update(dt);
    this.currentGamemode.postUpdate(dt);
  }
}

export default Game;

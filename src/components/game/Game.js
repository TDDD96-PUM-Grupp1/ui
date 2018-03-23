// import * as PIXI from 'pixi.js';
import EntityHandler from './EntityHandler';
import TestGamemode from './gamemodes/TestGamemode';
import CollisionHandler from './CollisionHandler';

/*
Game.
*/
class Game {
  constructor(app) {
    this.app = app;

    // Create all handlers
    this.entityHandler = new EntityHandler();
    this.collisionHandler = new CollisionHandler(this.entityHandler);

    // Create gamemode
    this.currentGamemode = new TestGamemode(this);
  }

  // Main game loop
  loop(delta) {
    // Convert frame delta to time delta [second] (assuming 60fps)
    const dt = delta / 60;

    // Update handlers and gamemodes
    this.currentGamemode.preUpdate(dt);
    this.entityHandler.update(dt);
    this.collisionHandler.handleCollisions(dt);
    this.entityHandler.updateGraphics(dt);
    this.currentGamemode.postUpdate(dt);
  }
}

export default Game;

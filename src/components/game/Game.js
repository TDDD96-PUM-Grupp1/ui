// import * as PIXI from 'pixi.js';
import EntityHandler from './EntityHandler';
import PlayerCircle from './PlayerCircle';
import PlayerController from './PlayerController';

/*
Game.
*/
class Game {
  constructor(app) {
    this.app = app;

    // Create all handlers
    this.entityHandler = new EntityHandler();

    // Make a test circle;
    const circle = new PlayerCircle(this.app);
    const player = new PlayerController();
    circle.setController(player);
    this.entityHandler.register(circle);
  }

  // Main game loop
  loop(delta) {
    // Convert frame delta to time delta [second] (assuming 60fps)
    const dt = delta / 60;

    // Update object handler
    this.entityHandler.update(dt);
  }
}

export default Game;

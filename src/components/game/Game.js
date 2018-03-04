import * as PIXI from 'pixi.js';

/*
Game.
*/
class Game {
  constructor(app) {
    // useless constructor
    this.app = app;

    // Make a test circle;
    const circle = new PIXI.Graphics();
    circle.beginFill(0xee66666);
    circle.drawCircle(0, 0, 32);
    circle.endFill();
    circle.x = 100;
    circle.y = 100;
    app.stage.addChild(circle);
    this.circle = circle;
  }

  // Main game loop
  loop(delta) {
    // Convert frame delta to time delta [second] (assuming 60fps)
    const dt = delta / 60;

    // Test basic loop update
    this.circle.x += 30 * dt;
  }
}

export default Game;

import * as PIXI from 'pixi.js';
import GameEntity from './GameEntity';

/*
Game object base class
*/
class PlayerCircle extends GameEntity {
  constructor(app) {
    super(app);

    // Create a graphical circle
    const circle = new PIXI.Graphics();
    circle.beginFill(0xee66666);
    circle.drawCircle(0, 0, 32);
    circle.endFill();
    circle.x = 100;
    circle.y = 100;
    app.stage.addChild(circle);
    this.circle = circle;
  }

  // Update this object
  update(dt) {
    super.update(dt);
  }
}

export default PlayerCircle;

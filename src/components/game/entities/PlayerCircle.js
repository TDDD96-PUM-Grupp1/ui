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
    app.stage.addChild(circle);
    this.graphic = circle;

    // this.x = 100;
    // this.y = 100;
    this.mass = 1;
  }

  // Update this object
  update(dt) {
    super.update(dt);
  }
}

export default PlayerCircle;

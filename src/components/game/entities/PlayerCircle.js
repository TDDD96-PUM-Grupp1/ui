import * as PIXI from 'pixi.js';
import GameEntity from './GameEntity';
import CollisionCircle from './collision/CollisionCircle';

/*
Game object representing a player
*/
class PlayerCircle extends GameEntity {
  constructor(app) {
    super(app);

    const RADIUS = 32;

    // Create a graphical circle
    const circle = new PIXI.Graphics();
    circle.beginFill(0xee66666);
    circle.drawCircle(0, 0, RADIUS);
    circle.endFill();
    app.stage.addChild(circle);
    this.graphic = circle;

    // Create the collison circle
    this.collision = new CollisionCircle(RADIUS);
    this.collision.setEntity(this);

    // set mass
    this.mass = 1;

    // set collision group
    this.collisionGroup = 1;
  }

  // Update this object
  update(dt) {
    super.update(dt);
  }
}

export default PlayerCircle;

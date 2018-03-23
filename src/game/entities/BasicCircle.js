import * as PIXI from 'pixi.js';
import GameEntity from './GameEntity';
import CollisionCircle from './collision/CollisionCircle';

/*
Game object with a basic circle graphic
*/
class BasicCircle extends GameEntity {
  constructor(app, radius, color) {
    super(app);

    this.radius = radius;

    // Create a graphical circle
    const circle = new PIXI.Graphics();
    circle.beginFill(0xfffffff);
    circle.drawCircle(0, 0, radius);
    circle.endFill();
    app.stage.addChild(circle);
    circle.tint = color;
    this.graphic = circle;

    // Create the collison circle
    this.collision = new CollisionCircle(radius);
    this.collision.setEntity(this);
  }
}

export default BasicCircle;

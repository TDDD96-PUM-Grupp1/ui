import * as PIXI from 'pixi.js';
import GameEntity from './GameEntity';
import CollisionRectangle from './collision/CollisionRectangle';

/*
Game object with a basic rectangle graphic
*/
class BasicRectangle extends GameEntity {
  constructor(app, width, height, mass, color) {
    super(app);

    this.width = width;
    this.height = height;
    this.mass = mass;

    // Calculate inertia
    this.I = (width * width + height * height) * mass / 3.0;

    // Create a graphical circle
    const circle = new PIXI.Graphics();
    circle.beginFill(0xfffffff);
    circle.drawRect(-width * 0.5, -height * 0.5, width, height);
    circle.endFill();
    app.stage.addChild(circle);
    circle.tint = color;
    this.graphic = circle;

    // Create the collison circle
    this.collision = new CollisionRectangle(width, height);
    this.collision.setEntity(this);
  }
}

export default BasicRectangle;

import * as PIXI from 'pixi.js';
import GameEntity from './GameEntity';
import CollisionRectangle from './collision/CollisionRectangle';

/*
Game object with a basic rectangle graphic and collision
*/
class BasicRectangle extends GameEntity {
  constructor(game, width, height, mass, color) {
    super(game);

    this.width = width;
    this.height = height;
    this.mass = mass;

    // Calculate inertia
    this.I = (width * width + height * height) * mass / 3.0;

    // Create a graphical rectangle
    const graphic = new PIXI.Graphics();
    graphic.beginFill(0xfffffff);
    graphic.drawRect(-width * 0.5, -height * 0.5, width, height);
    graphic.endFill();
    game.app.stage.addChild(graphic);
    graphic.tint = color;
    this.graphic = graphic;

    // Create the collison circle
    this.collision = new CollisionRectangle(width, height);
    this.collision.setEntity(this);
  }
}

export default BasicRectangle;

import * as PIXI from 'pixi.js';
import GameEntity from './GameEntity';
import CollisionCircle from './collision/CollisionCircle';

/*
Game object with a basic circle graphic and collision
*/
class BasicCircle extends GameEntity {
  constructor(game, radius, mass, color) {
    super(game);

    this.radius = radius;
    this.mass = mass;

    // Calculate inertia
    this.I = 0.5 * mass * radius * radius;

    // Create a graphical circle
    const graphic = new PIXI.Sprite(game.basicResources.circle);
    graphic.width = radius * 2;
    graphic.height = radius * 2;
    graphic.anchor.set(0.5, 0.5);
    game.app.stage.addChild(graphic);
    graphic.tint = color;
    this.graphic = graphic;

    // Create the collison circle
    this.collision = new CollisionCircle(radius);
    this.collision.setEntity(this);
  }
}

export default BasicCircle;

import * as PIXI from 'pixi.js';
import GameEntity from './GameEntity';
import CollisionCircle from './collision/CollisionCircle';

/*
Game object with a basic circle graphic and collision
*/
class BasicCircle extends GameEntity {
  constructor(game, radius, mass, color, outline, spawn = true) {
    super(game);

    this.radius = radius;
    this.mass = mass;

    // Calculate inertia
    this.I = 0.5 * mass * radius * radius;

    // Create a graphical circle
    const img = outline ? game.basicResources.circle_outline : game.basicResources.circle;
    const graphic = new PIXI.Sprite(img);
    graphic.width = radius * 2;
    graphic.height = radius * 2;
    graphic.anchor.set(0.5, 0.5);

    // This is also used for graphic creation,
    //in that case we do not want to spawn graphic to game
    if(spawn){
      game.app.stage.addChild(graphic);
    }

    graphic.tint = color;
    this.graphic = graphic;

    // Create the collison circle
    this.collision = new CollisionCircle(radius);
    this.collision.setEntity(this);
  }
}

export default BasicCircle;

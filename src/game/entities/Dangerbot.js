import * as PIXI from 'pixi.js';
import GameEntity from './GameEntity';
import CollisionCircle from './collision/CollisionCircle';
import PlayerCircle from './PlayerCircle';

/*
Circular object that will kill players that it touches.
*/
class Dangerbot extends GameEntity {
  constructor(game, radius, mass, resources) {
    super(game);

    this.radius = radius;
    this.mass = mass;

    // Calculate inertia
    this.I = 0.5 * mass * radius * radius;

    // Create a graphical circle
    const graphic = new PIXI.Sprite(resources.dangerbot);
    graphic.width = radius * 2;
    graphic.height = radius * 2;
    graphic.anchor.set(0.5, 0.5);
    game.app.stage.addChild(graphic);
    this.graphic = graphic;

    // Create the collison circle
    this.collision = new CollisionCircle(radius);
    this.collision.setEntity(this);
    this.collision.addListener((dangerbot, victim) => {
      if (victim instanceof PlayerCircle) {
        victim.die();
      }
    });
  }
}

export default Dangerbot;

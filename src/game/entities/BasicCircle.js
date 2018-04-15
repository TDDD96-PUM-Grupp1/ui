import * as PIXI from 'pixi.js';
import { BevelFilter } from 'pixi-filters';
import GameEntity from './GameEntity';
import CollisionCircle from './collision/CollisionCircle';

/*
Game object with a basic circle graphic and collision
*/
class BasicCircle extends GameEntity {
  constructor(app, radius, mass, color) {
    super(app);

    this.radius = radius;
    this.mass = mass;

    // Calculate inertia
    this.I = 0.5 * mass * radius * radius;

    // Create a graphical circle
    const graphic = new PIXI.Graphics();
    graphic.beginFill(0xfffffff);
    graphic.drawCircle(0, 0, radius);
    graphic.endFill();
    app.stage.addChild(graphic);
    graphic.tint = color;
    this.graphic = graphic;

    graphic.filters = [
      new BevelFilter({
        rotation: 90,
        lightAlpha: 0.2,
      }),
    ];

    // Create the collison circle
    this.collision = new CollisionCircle(radius);
    this.collision.setEntity(this);
  }
}

export default BasicCircle;

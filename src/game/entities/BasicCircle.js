import * as PIXI from 'pixi.js';
import GameEntity from './GameEntity';
import CollisionCircle from './collision/CollisionCircle';
import iconData from '../iconData';

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

    const texture = PIXI.Texture.fromImage('resources/icons/tiger.svg');
    const sprite = new PIXI.Sprite(texture);
    sprite.visible = true;
    sprite.position.x = 200;
    sprite.position.y = 200;
    sprite.anchor = 0.5;

    app.stage.addChild(sprite);

    // Create a graphical circle
    const graphic = new PIXI.Graphics();
    graphic.beginFill(0xfffffff);
    graphic.drawCircle(0, 0, radius);
    graphic.endFill();
    // app.stage.addChild(graphic);
    graphic.tint = color;
    // this.graphic = graphic;
    this.graphic = sprite;

    // Create the collison circle
    this.collision = new CollisionCircle(radius);
    this.collision.setEntity(this);
  }
}

export default BasicCircle;

import * as PIXI from 'pixi.js';
import GameEntity from './GameEntity';
import CollisionLine from './collision/CollisionLine';

/*
Game object with a basic line graphic and collision
*/
class BasicLine extends GameEntity {
  constructor(game, x, y, ex, ey, color) {
    super(game);

    this.x = x;
    this.y = y;
    this.ex = ex;
    this.ey = ey;
    this.mass = Infinity;

    // Calculate inertia
    this.I = Infinity;

    // Create a graphical circle
    const graphic = new PIXI.Graphics();
    graphic.lineStyle(2, 0xffffff);
    graphic.moveTo(0, 0);
    graphic.lineTo(ex - x, ey - y);
    graphic.tint = color;
    this.graphic = graphic;

    // Create the collison circle
    this.collision = new CollisionLine(ex, ey);
    this.collision.setEntity(this);
  }
}

export default BasicLine;

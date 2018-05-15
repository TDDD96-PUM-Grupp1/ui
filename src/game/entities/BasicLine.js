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
    this.dx = ex - x;
    this.dy = ey - y;
    // Infinite mass since we don't want lines to move
    this.mass = Infinity;

    // Calculate inertia
    this.I = Infinity;

    // Create a graphical line
    const graphic = new PIXI.Graphics();
    graphic.lineStyle(2, 0xffffff);
    graphic.moveTo(0, 0);
    graphic.lineTo(this.dx, this.dy);
    graphic.tint = color;
    this.graphic = graphic;

    // Create the collison line
    this.collision = new CollisionLine(this.dx, this.dy);
    this.collision.setEntity(this);
  }
}

export default BasicLine;

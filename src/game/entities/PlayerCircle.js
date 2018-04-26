import * as PIXI from 'pixi.js';
import BasicCircle from './BasicCircle';

const RADIUS = 32;
const MASS = 1;
const SQUAREROOTOF2 = 1.4142135623730951;
const ICONSIZE = Math.floor(256 * SQUAREROOTOF2);

/*
Game object representing a player
*/
class PlayerCircle extends BasicCircle {
  constructor(game, resource, spawn = true) {
    super(game, RADIUS, MASS, 0xffffff, true, spawn);

    this.sprite = new PIXI.Sprite(resource);
    this.sprite.width = ICONSIZE;
    this.sprite.height = ICONSIZE;
    // Center x,y
    this.sprite.anchor.set(0.5, 0.5);

    this.graphic.addChild(this.sprite);

    this.restitution = 1;

    // default player collision group is random so they will be able to collide
    this.collisionGroup = Math.random();
  }

  setColor(backgroundColor, iconColor) {
    this.graphic.tint = backgroundColor;
    if (iconColor !== undefined) {
      this.sprite.tint = iconColor;
    }
  }

  // Update this object
  update(dt) {
    super.update(dt);
  }

  // Update this entity's graphics
  // graphicUpdate(dt) {
  //   super.graphicUpdate(dt);

  //   this.sprite.x = this.x;
  //   this.sprite.y = this.y;
  //   this.sprite.rotation = this.rotation;
  // }

  // Destroy sprite when removed
  destroy() {
    super.destroy();
    this.sprite.destroy();
  }

  /* eslint-disable */
  isPlayer() {
    return true;
  }
  /* eslint-enable */
}

export default PlayerCircle;

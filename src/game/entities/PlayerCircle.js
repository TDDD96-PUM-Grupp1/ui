import * as PIXI from 'pixi.js';
import BasicCircle from './BasicCircle';

const RADIUS = 32;
const MASS = 1;
const SQUAREROOTOF2 = 1.4142135623730951;
const ICONSIZE = Math.floor(RADIUS * SQUAREROOTOF2);

/*
Game object representing a player
*/
class PlayerCircle extends BasicCircle {
  constructor(app, resource) {
    super(app, RADIUS, MASS, 0xff6600);

    this.sprite = new PIXI.Sprite(resource);
    this.sprite.width = ICONSIZE;
    this.sprite.height = ICONSIZE;
    // Center x,y
    this.sprite.anchor.set(0.5, 0.5);

    this.graphic.addChild(this.sprite);

    // set collision group
    this.collisionGroup = 1;
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

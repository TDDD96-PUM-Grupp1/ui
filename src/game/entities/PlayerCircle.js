import * as PIXI from 'pixi.js';
import BasicCircle from './BasicCircle';

const RADIUS = 32;
const MASS = 1;

/*
Game object representing a player
*/
class PlayerCircle extends BasicCircle {
  constructor(app, resource) {
    super(app, RADIUS, MASS, 0xff6600, resource);

    this.sprite = new PIXI.Sprite(resource);
    this.sprite.width = 50;
    this.sprite.height = 50;
    // Center x,y
    this.sprite.anchor.set(0.5, 0.5);

    app.stage.addChild(this.sprite);

    // set collision group
    this.collisionGroup = 1;
  }

  // Update this object
  update(dt) {
    super.update(dt);
  }

  // Update this entity's graphics
  graphicUpdate(dt) {
    super.graphicUpdate(dt);

    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }
}

export default PlayerCircle;

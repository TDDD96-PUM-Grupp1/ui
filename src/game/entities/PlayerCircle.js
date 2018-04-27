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
  constructor(game, resource) {
    super(game, RADIUS, MASS, 0xffffff, true);

    this.sprite = new PIXI.Sprite(resource);
    this.sprite.width = ICONSIZE;
    this.sprite.height = ICONSIZE;
    // Center x,y
    this.sprite.anchor.set(0.5, 0.5);

    this.graphic.addChild(this.sprite);

    this.restitution = 1;

    // Flag for if the player has left the game.
    this.playerLeft = false;

    // default player collision group is random so they will be able to collide
    this.collisionGroup = Math.random();
  }

  ownerLeft() {
    this.playerLeft = true;
    // Make controller passive
    this.controller.active = false;
    // Clear collision listeners
    this.collision.listeners = [];
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

  // Destroy sprite when removed
  destroy() {
    super.destroy();
    this.sprite.destroy();
  }

  isPlayer() {
    return !this.playerLeft;
  }
}

export default PlayerCircle;

import KnockOff from './KnockOff';

// Constants for self-changing gameboard size
const moveSpeed = 100;

/*
  Knock off gamemode with a randomly changing arena, get score by knocking other players off the it.
*/
class KnockOffWander extends KnockOff {
  constructor(game, resources) {
    super(game, resources);
    // Constants for how far the circle's center can move
    this.xleft = -100;
    this.xright = 100;
    this.yup = -25;
    this.ydown = 25;

    // Move everything to the up right corner
    this.arenaGraphic.x = -100;
    this.arenaGraphic.y = -25;

    this.moveHelperX = true;
    this.moveHelperY = false;
  }

  // Called before the game objects are updated.
  preUpdate(dt) {
    super.preUpdate(dt);

    if (this.moveHelperX && !this.moveHelperY) {
      // Move right
      this.moveRight(dt * moveSpeed);
    } else if (!this.moveHelperX && !this.moveHelperY) {
      // Move Down
      this.moveDown(dt * moveSpeed);
    } else if (!this.moveHelperX && this.moveHelperY) {
      // Move Left
      this.moveLeft(dt * moveSpeed);
    } else if (this.moveHelperX && this.moveHelperY) {
      // Move up
      this.moveUp(dt * moveSpeed);
    }
  }

  // X == true && Y == false
  moveRight(dt) {
    if (this.arenaGraphic.x + dt > this.xright) {
      this.moveHelperX = false;
    } else {
      this.arenaGraphic.x += dt;
    }
  }

  // X == false && Y == false
  moveDown(dt) {
    if (this.arenaGraphic.y + dt > this.ydown) {
      this.moveHelperY = true;
    } else {
      this.arenaGraphic.y += dt;
    }
  }

  // X == false && Y == true
  moveLeft(dt) {
    if (this.arenaGraphic.x - dt < this.xleft) {
      this.moveHelperX = true;
    } else {
      this.arenaGraphic.x -= dt;
    }
  }

  // X == true && Y == true
  moveUp(dt) {
    if (this.arenaGraphic.y - dt < this.yup) {
      this.moveHelperY = false;
    } else {
      this.arenaGraphic.y -= dt;
    }
  }

  // eslint-disable-next-line
  onWindowResize() {
    this.xright = this.game.gameStageWidth * 0.5 - this.arenaRadius;
    this.xleft = -this.xright;
  }

  static getConfig() {
    const superConf = super.getConfig();
    superConf.rules = [
      'Knock the players off whilist the arena is moving!',
      'Abillities:',
      'SuperHeavy - Become super heavy and knock your enemies with an extreme force!',
    ];
    return superConf;
  }
}

export default KnockOffWander;

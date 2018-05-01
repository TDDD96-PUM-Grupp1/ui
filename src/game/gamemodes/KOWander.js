import KnockOff from './KnockOff';

// Constants for self-changing gameboard size
const moveSpeed = 100;

/*
  Knock off gamemode with a randomly changing arena, get score by knocking other players off the it.
*/
class KOWander extends KnockOff {
  constructor(game, resources) {
    super(game, resources);
    // Move everything to the up right corner
    this.arenaCentery = this.arenaRadius;
    this.arenaCenterx = this.arenaRadius;
    this.arenaGraphic.x = this.arenaRadius;
    this.arenaGraphic.y = this.arenaRadius;

    // Constants for how far the circle's center can move
    this.xleft = this.arenaRadius;
    this.xright = this.game.app.screen.width - this.arenaRadius;
    this.yup = this.arenaRadius;
    this.ydown = this.game.app.screen.height - this.arenaRadius;

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
    if (this.arenaCenterx + dt > this.xright) {
      this.moveHelperX = false;
    } else {
      this.arenaCenterx += dt;
      this.arenaGraphic.x += dt;
    }
  }

  // X == false && Y == false
  moveDown(dt) {
    if (this.arenaCentery + dt > this.ydown) {
      this.moveHelperY = true;
    } else {
      this.arenaCentery += dt;
      this.arenaGraphic.y += dt;
    }
  }

  // X == false && Y == true
  moveLeft(dt) {
    if (this.arenaCenterx - dt < this.xleft) {
      this.moveHelperX = true;
    } else {
      this.arenaCenterx -= dt;
      this.arenaGraphic.x -= dt;
    }
  }

  // X == true && Y == true
  moveUp(dt) {
    if (this.arenaCentery - dt < this.yup) {
      this.moveHelperY = false;
    } else {
      this.arenaCentery -= dt;
      this.arenaGraphic.y -= dt;
    }
  }
}

export default KOWander;

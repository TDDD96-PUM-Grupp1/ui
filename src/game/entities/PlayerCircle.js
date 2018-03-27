import BasicCircle from './BasicCircle';

const RADIUS = 32;

/*
Game object representing a player
*/
class PlayerCircle extends BasicCircle {
  constructor(app) {
    super(app, RADIUS, 0xff6600);
    // set mass
    this.mass = 1;

    // set collision group
    this.collisionGroup = 1;
  }

  // Update this object
  update(dt) {
    super.update(dt);
  }
}

export default PlayerCircle;

import EntityController from './EntityController';

const MAX_ANGLE = 50;

/*
Player object controller, will handle taking input from player and modifying their objects.
*/
class PlayerController extends EntityController {
  constructor(id) {
    super();
    this.playerid = id;

    this.accelerationScale = 150;
  }

  init() {}

  // Update
  update(dt) {
    let beta = 0;
    let gamma = 0;

    beta = Math.min(MAX_ANGLE, Math.max(beta, -MAX_ANGLE));
    beta = beta / MAX_ANGLE * Math.PI;
    gamma = Math.min(MAX_ANGLE, Math.max(gamma, -MAX_ANGLE));
    gamma = gamma / MAX_ANGLE * Math.PI;

    const xacc = Math.sin(beta) * this.accelerationScale;
    const yacc = Math.sin(gamma) * this.accelerationScale;

    this.entity.ax = 0;
    this.entity.ay = 0;
    this.entity.vx *= 0.97;
    this.entity.vy *= 0.97;
  }
}

export default PlayerController;

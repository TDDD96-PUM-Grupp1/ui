import EntityController from './EntityController';

const MAX_ANGLE = 50;

/*
Player object controller, will handle taking input from player and modifying their objects.
*/
class PlayerController extends EntityController {
  constructor(game, id) {
    super();
    this.game = game;
    this.playerid = id;

    this.accelerationScale = 150;
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */
  init() {}

  // Update
  update(dt) {
    const playerData = this.game.communication.getPlayerInfo(this.id);
    let [beta, gamma] = playerData.sensor;

    beta = Math.min(MAX_ANGLE, Math.max(beta, -MAX_ANGLE));
    beta = beta / MAX_ANGLE * Math.PI;
    gamma = Math.min(MAX_ANGLE, Math.max(gamma, -MAX_ANGLE));
    gamma = gamma / MAX_ANGLE * Math.PI;

    const xacc = Math.sin(beta) * this.accelerationScale;
    const yacc = Math.sin(gamma) * this.accelerationScale;

    this.entity.ax = xacc;
    this.entity.ay = yacc;
    this.entity.vx *= 0.97;
    this.entity.vy *= 0.97;
  }
}

export default PlayerController;

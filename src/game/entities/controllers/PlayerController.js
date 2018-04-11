import EntityController from './EntityController';

const MAX_ANGLE = 50;

/*
Player object controller, will handle taking input from player and modifying their objects.
*/
class PlayerController extends EntityController {
  constructor(game, id) {
    super();
    this.game = game;
    this.id = id;

    this.accelerationScale = 150;
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */
  init() {}

  // Update
  update(dt) {
    const playerData = this.game.instance.getPlayer(this.id);
    if (playerData !== undefined) {
      let { beta, gamma } = playerData.sensor;

      beta = Math.min(MAX_ANGLE, Math.max(beta, -MAX_ANGLE));
      beta = beta / MAX_ANGLE * Math.PI * 0.5;
      gamma = Math.min(MAX_ANGLE, Math.max(gamma, -MAX_ANGLE));
      gamma = gamma / MAX_ANGLE * Math.PI * 0.5;

      const xacc = Math.sin(beta) * this.accelerationScale;
      const yacc = -Math.sin(gamma) * this.accelerationScale;

      this.entity.vx = xacc;
      this.entity.vy = yacc;
      // this.entity.vx *= 0.97;
      // this.entity.vy *= 0.97;
    }
  }
}

export default PlayerController;

import EntityController from './EntityController';

const MAX_ANGLE = 40;
const MAX_ACC = 500;
const MIN_SENSOR_THRESHOLD = 5;

/*
Player object controller, will handle taking input from player and modifying their objects.
*/
class PlayerController extends EntityController {
  constructor(game, id) {
    super();
    this.game = game;
    this.id = id;

    this.accelerationScale = 1000;
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */
  init() {}

  // Update
  update(dt) {
    if (!this.game.instance) {
      return;
    }
    const playerData = this.game.instance.getPlayer(this.id);
    if (playerData !== undefined) {
      let { beta, gamma } = playerData.sensor;

      if (Math.abs(beta) < MIN_SENSOR_THRESHOLD) {
        beta = 0;
      }

      if (Math.abs(gamma) < MIN_SENSOR_THRESHOLD) {
        gamma = 0;
      }

      beta = Math.min(MAX_ANGLE, Math.max(beta, -MAX_ANGLE));
      beta = beta / MAX_ANGLE * Math.PI * 0.5;
      gamma = Math.min(MAX_ANGLE, Math.max(gamma, -MAX_ANGLE));
      gamma = gamma / MAX_ANGLE * Math.PI * 0.5;

      const length = Math.sqrt(beta * beta + gamma * gamma);
      if (length > 1) {
        beta /= length;
        gamma /= length;
      }

      // const xacc = Math.sin(beta) * this.accelerationScale;
      // const yacc = -Math.sin(gamma) * this.accelerationScale;

      const xacc = beta * this.accelerationScale;
      const yacc = -gamma * this.accelerationScale;

      // P or PID regulator??
      // Testing P

      let pax = -this.entity.vx + xacc;
      let pay = -this.entity.vy + yacc;

      pax = Math.min(MAX_ACC, Math.max(pax, -MAX_ACC));
      pay = Math.min(MAX_ACC, Math.max(pay, -MAX_ACC));

      this.entity.ax = pax;
      this.entity.ay = pay;
    }
  }
}

export default PlayerController;

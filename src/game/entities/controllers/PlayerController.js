import EntityController from './EntityController';

const MAX_ANGLE = 50;
const MAX_ACC = 650;
const MIN_SENSOR_THRESHOLD = 5;

const MAX_ANGLE_SQ = MAX_ANGLE * MAX_ANGLE;
const MAX_ACC_SQ = MAX_ACC * MAX_ACC;
const MIN_SENSOR_THRESHOLD_SQ = MIN_SENSOR_THRESHOLD * MIN_SENSOR_THRESHOLD;

/*
Player object controller, will handle taking input from player and modifying their objects.
*/
class PlayerController extends EntityController {
  constructor(game, id) {
    super();
    this.game = game;
    this.id = id;

    this.active = true;

    this.accelerationScale = 1900;
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */
  init() {}

  // Update
  update(dt) {
    let xacc = 0;
    let yacc = 0;
    if (this.active && this.game.instance) {
      const playerData = this.game.instance.getPlayer(this.id);
      if (playerData !== undefined) {
        let { beta, gamma } = playerData.sensor;

        if (beta * beta + gamma * gamma < MIN_SENSOR_THRESHOLD_SQ) {
          beta = 0;
          gamma = 0;
        }

        let length = MAX_ANGLE;
        const sqlength = beta * beta + gamma * gamma;
        if (sqlength > MAX_ANGLE_SQ) {
          length = Math.sqrt(sqlength);
        }
        // console.log(`Tilt: b:${beta} g:${gamma}, effective b:${beta/length} g:${gamma/length}`);
        beta /= length;
        gamma /= length;

        /* length = Math.sqrt(beta * beta + gamma * gamma);
        if (length > 1) {
          beta /= length;
          gamma /= length;
        } */

        // const xacc = Math.sin(beta) * this.accelerationScale;
        // const yacc = -Math.sin(gamma) * this.accelerationScale;

        xacc = beta * this.accelerationScale;
        yacc = -gamma * this.accelerationScale;
      }
    }
    // P or PID regulator??
    // Testing P

    let pax = -this.entity.vx + xacc;
    let pay = -this.entity.vy + yacc;

    const sqlength = pax * pax + pay * pay;
    if (sqlength > MAX_ACC_SQ) {
      const norm = MAX_ACC / Math.sqrt(sqlength);
      pax *= norm;
      pay *= norm;
    }

    this.entity.ax = pax;
    this.entity.ay = pay;
  }
}

export default PlayerController;

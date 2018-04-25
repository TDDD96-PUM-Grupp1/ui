import EntityController from './EntityController';

/*
Player object controller, will handle taking input from player and modifying their objects.
*/
class DangerbotController extends EntityController {
  constructor(game) {
    super();
    this.game = game;

    this.overshoot = 150;
    this.maxacc = 500;
    this.stopDist = 50;
    this.stopScale = 3;
    this.stopAccuracy = 2;

    this.destx = 0;
    this.desty = 0;

    this.idleTime = 0.1;
    this.timer = this.idleTime;
    this.state = 'idle';
  }

  // Update
  update(dt) {
    switch (this.state) {
      case 'idle':
        this.timer -= dt;
        if (this.timer <= 0) {
          this.state = 'pick';
        }
        break;
      case 'pick': {
        const players = this.game.entityHandler.getPlayers();
        const eligible = [];
        players.forEach(player => {
          if (!player.phasing && !player.dead) {
            eligible.push(player);
          }
        });
        if (eligible.length > 0) {
          const player = eligible[Math.floor(Math.random() * eligible.length)];
          const angle = Math.atan2(player.y - this.entity.y, player.x - this.entity.x);

          this.destx = player.x + Math.cos(angle) * this.overshoot;
          this.desty = player.y + Math.sin(angle) * this.overshoot;

          this.state = 'moving';
        } else {
          this.state = 'idle';
          this.timer = this.idleTime;
        }
        break;
      }
      case 'moving': {
        const xacc = this.destx - this.entity.x;
        const yacc = this.desty - this.entity.y;
        if (xacc * xacc + yacc * yacc <= this.stopDist * this.stopDist) {
          // Close enough
          this.state = 'stopping';
          this.update(dt);
          break;
        }
        // xacc = Math.min(this.maxacc, Math.max(xacc, -this.maxacc));
        // yacc = Math.min(this.maxacc, Math.max(yacc, -this.maxacc));
        this.entity.ax = xacc;
        this.entity.ay = yacc;
        break;
      }
      case 'stopping': {
        const { vx, vy } = this.entity;
        if (vx * vx + vy * vy <= this.stopAccuracy * this.stopAccuracy) {
          // Stopped
          this.entity.ax = 0;
          this.entity.ay = 0;
          this.entity.vx = 0;
          this.entity.vy = 0;
          this.timer = this.idleTime;
          this.state = 'idle';
          break;
        }
        this.entity.ax = -vx * this.stopScale;
        this.entity.ay = -vy * this.stopScale;
        break;
      }
      default:
    }
  }
}

export default DangerbotController;

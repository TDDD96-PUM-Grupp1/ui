import EntityController from './EntityController';

/*
Dangerbot controller, will target a player and rush towards them.
*/
class DangerbotController extends EntityController {
  constructor(game) {
    super();
    this.game = game;

    this.overshoot = 150;
    this.maxacc = 500;
    this.stopDist = 50;
    this.stopScale = 3;
    this.stopSpeed = 20;

    this.destx = 0;
    this.desty = 0;

    this.idleTime = 0.05;
    this.baseStareTime = 0.55;
    this.stareTime = this.baseStareTime;
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
          this.target = player;
          this.state = 'stare';
          this.stareTime = this.baseStareTime + 0.2 * Math.random() - 0.1;
          this.timer = this.stareTime;
        } else {
          this.state = 'idle';
          this.timer = this.idleTime;
        }
        break;
      }
      case 'stare': {
        if (!this.target || this.target.dead) {
          this.state = 'idle';
          this.timer = this.idleTime;
          break;
        }
        this.timer -= dt;
        const angle = Math.atan2(this.target.y - this.entity.y, this.target.x - this.entity.x);
        const angleDiff = angle - this.entity.rotation;
        this.entity.rotation +=
          (this.stareTime - this.timer) * Math.atan2(Math.sin(angleDiff), Math.cos(angleDiff));
        if (this.timer <= 0) {
          this.destx = this.target.x + Math.cos(angle) * this.overshoot;
          this.desty = this.target.y + Math.sin(angle) * this.overshoot;
          this.state = 'moving';
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
        this.entity.ax = xacc;
        this.entity.ay = yacc;
        break;
      }
      case 'stopping': {
        const { vx, vy } = this.entity;
        if (vx * vx + vy * vy <= this.stopSpeed * this.stopSpeed) {
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

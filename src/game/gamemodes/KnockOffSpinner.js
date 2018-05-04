import KnockOff from './KnockOff';
import BasicRectangle from '../entities/BasicRectangle';

/*
  Knock off gamemode with a randomly changing arena, get score by knocking other players off the it.
*/
class KnockOffSpinner extends KnockOff {
  constructor(game, resources) {
    super(game, resources);

    this.spawnDistance = 150;

    this.addSpinner(0, 0, 140, 10);
    // this.addSpinner(0, 0, 10, 140);
  }

  addSpinner(x, y, width, height) {
    const spinner = new BasicRectangle(this.game, width, height, Infinity, 0x33df45);
    spinner.x = x;
    spinner.y = y;
    spinner.rv = 15;
    spinner.restitution = 0.1;
    spinner.floorFriction = 0;

    this.game.register(spinner);
  }

  onPlayerCreated(player, circle) {
    const angle = Math.random() * 2 * Math.PI;
    circle.x = this.spawnDistance * Math.cos(angle);
    circle.y = this.spawnDistance * Math.sin(angle);
  }

  onRespawn(circle) {
    const angle = Math.random() * 2 * Math.PI;
    circle.x = this.spawnDistance * Math.cos(angle);
    circle.y = this.spawnDistance * Math.sin(angle);
  }
}

export default KnockOffSpinner;

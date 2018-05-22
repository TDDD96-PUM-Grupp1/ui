import Dodgebot from './Dodgebot';
import BasicCircle from '../entities/BasicCircle';

/*
  Dodgebot but there are bumpers that will bump you away!
*/
class DodgebotBumper extends Dodgebot {
  constructor(game, resources) {
    super(game, resources);

    this.addBumper(-300, -300, 70);
    this.addBumper(300, -300, 70);
    this.addBumper(-300, 300, 70);
    this.addBumper(300, 300, 70);
  }

  addBumper(x, y, radius) {
    const bumper = new BasicCircle(this.game, radius, Infinity, 0xbb2277, true);
    bumper.x = x;
    bumper.y = y;
    bumper.restitution = 2;

    // If these are registered as walls then they can push the players out of the square
    this.game.register(bumper);
  }

  static getConfig() {
    const superConf = super.getConfig();
    superConf.rules = [
      'Avoid the killer robots that try to kill you and the bumper!',
      'Abilities:',
      'Speed Boost - Increases the speed of the player to easier avoid the bots!',
    ];
    return superConf;
  }
}

export default DodgebotBumper;

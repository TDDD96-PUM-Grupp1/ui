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

    this.game.register(bumper);
  }
}

export default DodgebotBumper;

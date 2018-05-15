import Gamemode from './Gamemode';
import BasicRectangle from '../entities/BasicRectangle';
import BasicLine from '../entities/BasicLine';

/*
Test gamemode.
*/
class TestGamemode extends Gamemode {
  constructor(game, resources) {
    super(game, resources);

    const rect = new BasicRectangle(this.game, 640, 32, 10, 0x88ee11);
    // const rectc = new TestController(700, 500, 0, 0, 0.8, 1.1);
    // rect.setController(rectc);
    rect.x = 200;
    rect.y = 200;
    rect.collisionGroup = 1;
    rect.staticFriction = 0.8;
    rect.dynamicFriction = 0.4;
    rect.rv = 1;
    rect.mass = Infinity;
    rect.floorFriction = 0;
    this.game.register(rect);

    this.addLine(-500, -500, 500, -500);
    this.addLine(500, -500, 500, 500);
    this.addLine(-500, -500, -500, 500);
    this.addLine(-500, 500, 500, 500);
  }

  addLine(x, y, ex, ey) {
    const line = new BasicLine(this.game, x, y, ex, ey, 0x6633ff);
    line.staticFriction = 0;
    line.dynamicFriction = 0;
    line.restitution = 1;
    line.collisionGroup = 1;
    this.game.register(line);
  }
}

export default TestGamemode;

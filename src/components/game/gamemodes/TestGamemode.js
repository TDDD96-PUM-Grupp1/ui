import PlayerCircle from '../entities/PlayerCircle';
import Gamemode from './Gamemode';
import TestController from '../entities/controllers/TestController';
import PlayerController from '../entities/controllers/PlayerController';

/*
Test gamemode.
*/
class TestGamemode extends Gamemode {
  constructor(game) {
    super(game);
    // Make a test circle;
    const circle = new PlayerCircle(this.game.app);
    const controller = new TestController(300, 300, 150, 150, 1, 1.2);
    circle.setController(controller);
    this.game.entityHandler.register(circle);

    const circle2 = new PlayerCircle(this.game.app);
    const controller2 = new TestController(450, 300, 150, 150, 0.7, 1.5);
    circle2.setController(controller2);
    this.game.entityHandler.register(circle2);

    const circle3 = new PlayerCircle(this.game.app);
    const controller3 = new PlayerController(1);
    circle3.setController(controller3);
    circle3.x = 0;
    circle3.y = 0;
    circle3.setColor(0xffffff);
    this.game.entityHandler.register(circle3);
  }
  /* eslint-disable class-methods-use-this, no-unused-vars */
  // Called before the game objects are updated.
  preUpdate(dt) {}

  // Called after the game objects are updated.
  postUpdate(dt) {}

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.game.entityHandler.clear();
  }
  /* eslint-enable class-methods-use-this, no-unused-vars */
}

export default TestGamemode;

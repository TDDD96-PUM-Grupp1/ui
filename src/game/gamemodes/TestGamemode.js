import PlayerCircle from '../entities/PlayerCircle';
import Gamemode from './Gamemode';
import TestController from '../entities/controllers/TestController';
import PlayerController from '../entities/controllers/PlayerController';
import LocalPlayerController from '../entities/controllers/LocalPlayerController';
import BasicRectangle from '../entities/BasicRectangle';

/*
Test gamemode.
*/
class TestGamemode extends Gamemode {
  constructor(game) {
    super(game);
    // Make a test circle;
    const circle = new PlayerCircle(this.game.app);
    const controller = new TestController(300, 300, 0, 0, 1, 1.2);
    circle.setController(controller);
    this.game.entityHandler.register(circle);

    const circle2 = new PlayerCircle(this.game.app);
    const controller2 = new TestController(450, 300, 0, 0, 0.7, 1.5);
    circle2.setController(controller2);
    this.game.entityHandler.register(circle2);

    const rect = new BasicRectangle(this.game.app, 640, 32, 10, 0x88ee11);
    const rectc = new TestController(700, 500, 0, 0, 0.8, 1.1);
    rect.setController(rectc);
    rect.collisionGroup = 1;
    rect.staticFriction = 0.8;
    rect.dynamicFriction = 0.4;
    rect.rv = 1;
    this.game.entityHandler.register(rect);

    const circle3 = new PlayerCircle(this.game.app);
    const controller3 = new LocalPlayerController(1);
    circle3.setController(controller3);
    circle3.x = 0;
    circle3.y = 0;
    circle3.setColor(0xee6666);
    this.game.entityHandler.register(circle3);
  }

  /* eslint-disable no-unused-vars */
  // Called before the game objects are updated.
  preUpdate(dt) {
    // Simple bounce when ball leaves boundary
    this.game.entityHandler.getEntities().forEach(entity => {
      if (entity.x < 0 || entity.x > this.game.app.screen.width) {
        entity.vx *= -1;
      }
      if (entity.y < 0 || entity.y > this.game.app.screen.height) {
        entity.vy *= -1;
      }
    });
  }
  /* eslint-enable no-unused-vars */

  /* eslint-disable class-methods-use-this, no-unused-vars */

  // Called after the game objects are updated.
  postUpdate(dt) {}

  // Called when a new player connects
  onPlayerJoin(idTag) {
    const circle = new PlayerCircle(this.game.app);
    const controller = new PlayerController(this.game, idTag);
    circle.setController(controller);
    circle.x = 400;
    circle.y = 400;
    circle.setColor(0xff3333);
    this.game.entityHandler.register(circle);
  }

  // Called when a player disconnects
  onPlayerLeave(idTag) {}

  /* eslint-enable class-methods-use-this, no-unused-vars */

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.game.entityHandler.clear();
  }
}

export default TestGamemode;

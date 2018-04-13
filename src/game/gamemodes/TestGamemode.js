import PlayerCircle from '../entities/PlayerCircle';
import Gamemode from './Gamemode';
import TestController from '../entities/controllers/TestController';
import PlayerController from '../entities/controllers/PlayerController';
import LocalPlayerController from '../entities/controllers/LocalPlayerController';
import BasicRectangle from '../entities/BasicRectangle';
import BasicLine from '../entities/BasicLine';
import iconData from '../iconData';

/*
Test gamemode.
*/
class TestGamemode extends Gamemode {
  constructor(game) {
    super(game);

    const rect = new BasicRectangle(this.game.app, 640, 32, 10, 0x88ee11);
    const rectc = new TestController(700, 500, 0, 0, 0.8, 1.1);
    rect.setController(rectc);
    rect.x = 700;
    rect.y = 500;
    rect.collisionGroup = 1;
    rect.staticFriction = 0.8;
    rect.dynamicFriction = 0.4;
    rect.rv = 1;
    rect.mass = Infinity;
    rect.floorFriction = 0;
    this.game.entityHandler.register(rect);

    this.game.resourceServer
      .requestResources([{ name: iconData[5].name, path: iconData[5].img }])
      .then(resources => {
        const circle3 = new PlayerCircle(this.game.app, resources[iconData[5].name]);
        const controller3 = new LocalPlayerController(1);
        circle3.setController(controller3);
        circle3.x = 50;
        circle3.y = 50;
        circle3.setColor(0xee6666);
        this.game.entityHandler.register(circle3);
      });

    this.addLine(0, 0, this.game.app.screen.width, 0);
    this.addLine(
      this.game.app.screen.width,
      0,
      this.game.app.screen.width,
      this.game.app.screen.height,
    );
    this.addLine(0, 0, 0, this.game.app.screen.height);
    this.addLine(
      0,
      this.game.app.screen.height,
      this.game.app.screen.width,
      this.game.app.screen.height,
    );
  }

  addLine(x, y, ex, ey) {
    const line = new BasicLine(this.game.app, x, y, ex, ey, 0x6633ff);
    line.staticFriction = 0;
    line.dynamicFriction = 0;
    line.restitution = 1;
    line.collisionGroup = 1;
    this.game.entityHandler.register(line);
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */
  // Called before the game objects are updated.
  preUpdate(dt) {
    // Simple bounce when ball leaves boundary
    /* this.game.entityHandler.getEntities().forEach(entity => {
      if (entity.x < 0 || entity.x > this.game.app.screen.width) {
        entity.vx *= -1;
      }
      if (entity.y < 0 || entity.y > this.game.app.screen.height) {
        entity.vy *= -1;
      }
    }); */
  }

  // Called after the game objects are updated.
  postUpdate(dt) {}

  // Called when a new player connects
  onPlayerJoin(idTag, iconID) {
    this.game.resourceServer
      .requestResources([{ name: iconData[iconID].name, path: iconData[iconID].img }])
      .then(resources => {
        const circle = new PlayerCircle(this.game.app, resources[iconData[iconID].name]);
        const controller = new PlayerController(this.game, idTag);
        circle.setController(controller);
        circle.x = 400;
        circle.y = 400;
        circle.setColor(0xff3333);
        this.game.entityHandler.register(circle);
      });
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

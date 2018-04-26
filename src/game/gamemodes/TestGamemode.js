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
    rect.x = 700;
    rect.y = 500;
    rect.collisionGroup = 1;
    rect.staticFriction = 0.8;
    rect.dynamicFriction = 0.4;
    rect.rv = 1;
    rect.mass = Infinity;
    rect.floorFriction = 0;
    this.game.register(rect);

    this.addLine(0, 0, this.game.app.screen.width, 0);
    this.addLine(
      this.game.app.screen.width,
      0,
      this.game.app.screen.width,
      this.game.app.screen.height
    );
    this.addLine(0, 0, 0, this.game.app.screen.height);
    this.addLine(
      0,
      this.game.app.screen.height,
      this.game.app.screen.width,
      this.game.app.screen.height
    );
  }

  addLine(x, y, ex, ey) {
    const line = new BasicLine(this.game, x, y, ex, ey, 0x6633ff);
    line.staticFriction = 0;
    line.dynamicFriction = 0;
    line.restitution = 1;
    line.collisionGroup = 1;
    this.game.register(line);
  }

  // Called before the game objects are updated.
  // eslint-disable-next-line
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
  // eslint-disable-next-line
  postUpdate(dt) {}

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    const idTag = playerObject.id;

    this.game.register(circle);
    circle.collisionGroup = idTag;
  }

  // Called when a player disconnects
  // eslint-disable-next-line
  onPlayerLeave(idTag) {}

  /* eslint-enable class-methods-use-this, no-unused-vars */

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.game.entityHandler.clear();
  }

  // Has to be overridden
  // eslint-disable-next-line class-methods-use-this
  onWindowResize() {}
}

export default TestGamemode;

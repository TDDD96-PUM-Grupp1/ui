import PlayerCircle from '../entities/PlayerCircle';
import PlayerController from '../entities/controllers/PlayerController';
import Gamemode from './Gamemode';

/*
Test gamemode.
*/
class TestGamemode extends Gamemode {
  constructor(game) {
    super(game);
    // Make a test circle;
    const circle = new PlayerCircle(this.game.app);
    const player = new PlayerController();
    circle.setController(player);
    this.game.entityHandler.register(circle);
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

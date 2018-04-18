// import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';
import Dangerbot from '../entities/Dangerbot';
import DangerbotController from '../entities/controllers/DangerbotController';

// Respawn time in seconds
const RESPAWN_TIME = 1;
/*
  Knock off gamemode, get score by knocking other players off the arena.
*/
class Dodgebot extends Gamemode {
  constructor(game, resources) {
    super(game, resources);
    this.game.respawnHandler.registerRespawnListener(this);

    this.players = {};
    this.respawn = {};

    // Create the dangerbot
    const dangerbot = new Dangerbot(game, 25, Infinity);
    dangerbot.x = 500;
    dangerbot.y = 500;
    dangerbot.setColor(0xff0101);
    dangerbot.setController(new DangerbotController(game));
    game.entityHandler.register(dangerbot);
  }

  /* eslint-disable no-unused-vars, class-methods-use-this */

  // Called before the game objects are updated.
  preUpdate(dt) {}

  /* eslint-enable no-unused-vars, class-methods-use-this */

  /* eslint-disable class-methods-use-this, no-unused-vars */

  // Called after the game objects are updated.
  postUpdate(dt) {}

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    const { iconID } = playerObject;
    const idTag = playerObject.id;

    // Place them in the middle of the arena for now
    circle.x = 300;
    circle.y = 300;

    this.game.entityHandler.register(circle);

    circle.collisionGroup = idTag;

    circle.phase(3);

    this.players[idTag] = circle;
    this.respawn[idTag] = true;

    circle.addEntityListener(this);
  }

  // Called when a player disconnects
  onPlayerLeave(idTag) {
    // When a player leaves, just leave their entity on the map.
    // But stop them from respawning.
    this.respawn[idTag] = false;
  }

  onButtonPressed(id, button) {}

  // Called when an entity is respawned.
  onRespawn(entity) {
    // Move the entity close to the center
    entity.x = 400;
    entity.y = 400;

    // Phase the entity for a bit
    entity.phase(2);
  }

  /* eslint-enable class-methods-use-this, no-unused-vars */

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.game.entityHandler.clear();
    // TODO: Clear respawns
    // this.game.respawnHandler.clear();
  }

  // Called when an entity dies.
  onDeath(entity) {
    const { id } = entity.controller;

    if (this.respawn[id]) {
      this.game.respawnHandler.addRespawn(entity, RESPAWN_TIME);
    } else {
      this.game.entityHandler.unregisterFully(entity);
    }
  }

  /* eslint-disable class-methods-use-this */
  onWindowResize() {}
}

export default Dodgebot;

// import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';
import Dangerbot from '../entities/Dangerbot';
import DangerbotController from '../entities/controllers/DangerbotController';
import BasicRectangle from '../entities/BasicRectangle';
import HighscoreList from '../HighscoreList';

// Respawn time in seconds
const RESPAWN_TIME = 1;

// How many walls the arena should have.
const WALLS = 4;

/*
  Knock off gamemode, get score by knocking other players off the arena.
*/
class Dodgebot extends Gamemode {
  constructor(game, resources) {
    super(game, resources);
    this.game.respawnHandler.registerRespawnListener(this);

    game.scoreManager.addScoreType('Time Alive', 0, true);
    game.scoreManager.addScoreType('Deaths', 0);
    game.scoreManager.setAscOrder(false);
    this.hs_list = new HighscoreList(game.scoreManager, game);

    this.players = {};
    this.respawn = {};

    this.time = 0;

    // Create the dangerbots
    this.createDangerbot(500, 500);
    this.createDangerbot(0, 0);

    // Create the arena
    this.arenaSize = 700;
    this.arenaWidth = 30;
    this.wallLength = this.arenaSize + this.arenaWidth;
    this.centerx = 500;
    this.centery = 500;
    // rads / sec
    this.rv = 0.1;
    this.rotation = 0;

    this.walls = [];
    this.wallAngles = [];
    for (let i = 0; i < WALLS; i += 1) {
      const wall = new BasicRectangle(game, this.arenaWidth, this.wallLength, Infinity, 0x44ff66);
      const angle = Math.PI * 2 * i / WALLS;
      this.walls.push(wall);
      this.wallAngles.push(angle);
      wall.rotation = angle;
      wall.floorFriction = 0;
      wall.restitution = 0;
      wall.rv = this.rv;
      game.entityHandler.register(wall);
      wall.x = this.centerx + Math.cos(angle) * this.arenaSize * 0.5;
      wall.y = this.centery + Math.sin(angle) * this.arenaSize * 0.5;
    }
  }

  /* eslint-disable no-unused-vars, class-methods-use-this */

  createDangerbot(x, y) {
    const dangerbot = new Dangerbot(this.game, 25, Infinity);
    dangerbot.x = x;
    dangerbot.y = y;
    dangerbot.setColor(0xff0101);
    dangerbot.setController(new DangerbotController(this.game));
    this.game.entityHandler.register(dangerbot);
  }

  // Called before the game objects are updated.
  preUpdate(dt) {
    this.time += dt;

    const rvo = 0.75 + 0.25 * Math.cos(this.time);
    this.rv = 0.3 * rvo * Math.sin(this.time * 0.1);
    this.rotation += this.rv * dt;

    this.centerx += 15 * Math.sin(this.time * 0.05) * dt;

    for (let i = 0; i < WALLS; i += 1) {
      const wall = this.walls[i];
      const angle = this.wallAngles[i];

      const oldx = wall.x;
      const oldy = wall.y;
      const newx = this.centerx + Math.cos(angle + this.rotation) * this.arenaSize * rvo * 0.5;
      const newy = this.centery + Math.sin(angle + this.rotation) * this.arenaSize * rvo * 0.5;
      wall.vx = (newx - oldx) / dt;
      wall.vy = (newy - oldy) / dt;
      wall.rv = this.rv;
    }
  }

  /* eslint-enable no-unused-vars, class-methods-use-this */

  /* eslint-disable class-methods-use-this, no-unused-vars */

  // Called after the game objects are updated.
  postUpdate(dt) {
    Object.keys(this.players).forEach(id => {
      const entity = this.players[id];

      // Increase score if player is alive
      // TODO: Better way to determine this
      if (!entity.phasing && !entity.dead) {
        this.game.scoreManager.addScore('Time Alive', id, dt);
      }
    });
  }

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    const { iconID } = playerObject;
    const idTag = playerObject.id;

    // Place them in the middle of the arena for now
    circle.x = 300;
    circle.y = 300;

    this.game.entityHandler.register(circle);

    circle.collisionGroup = idTag;

    circle.moveWhilePhased = false;
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
    entity.x = this.centerx;
    entity.y = this.centery;

    // Phase the entity for a bit
    entity.dead = false;
    entity.phase(1.5);
  }

  /* eslint-enable class-methods-use-this, no-unused-vars */

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.game.entityHandler.clear();
    this.game.respawnHandler.clean();
  }

  // Called when an entity dies.
  onDeath(entity) {
    const { id } = entity.controller;

    this.game.scoreManager.setScore('Time Alive', id, 0);
    this.game.scoreManager.addScore('Deaths', id, 1);

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

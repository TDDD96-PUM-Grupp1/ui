import Gamemode from './Gamemode';
import Dangerbot from '../entities/Dangerbot';
import DangerbotController from '../entities/controllers/DangerbotController';
import BasicRectangle from '../entities/BasicRectangle';

// How many walls the arena should have.
const WALLS = 4;

/*
  Dodgebot gamemode, get points by surviving for as long as possible.
*/
class Dodgebot extends Gamemode {
  constructor(game, resources) {
    super(game, resources);
    this.game.respawnHandler.registerRespawnListener(this);

    this.time = 0;

    // Create the dangerbots
    this.createDangerbot(200, 200);
    this.createDangerbot(-200, -200);

    // Create the arena
    this.arenaSize = 700;
    this.arenaWidth = 30;
    this.wallLength = this.arenaSize + this.arenaWidth;
    this.centerx = 0;
    this.centery = 0;
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
      game.register(wall);
      wall.x = this.centerx + Math.cos(angle) * this.arenaSize * 0.5;
      wall.y = this.centery + Math.sin(angle) * this.arenaSize * 0.5;
    }
  }

  createDangerbot(x, y) {
    const dangerbot = new Dangerbot(this.game, 25, Infinity, this.resources);
    dangerbot.x = x;
    dangerbot.y = y;
    dangerbot.setColor(0xff0101);
    dangerbot.setController(new DangerbotController(this.game));
    this.game.register(dangerbot);
  }

  // Called before the game objects are updated.
  preUpdate(dt) {
    this.time += dt;

    const rvo = 0.75 + 0.25 * Math.cos(this.time);
    this.rv = 0.3 * rvo * Math.sin(this.time * 0.1);
    this.rotation += this.rv * dt;

    this.centerx += 15 * Math.cos(this.time * 0.05) * dt;

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

  /* eslint-disable class-methods-use-this, no-unused-vars */

  // Called after the game objects are updated.
  postUpdate(dt) {
    Object.keys(this.players).forEach(id => {
      const entity = this.players[id];

      // Increase best score if time alive is higher
      if (!entity.dead) {
        const bestScore = this.game.scoreManager.getScore('Best Time Alive', id);
        const score = this.game.scoreManager.getScore('Time Alive', id);
        if (score > bestScore) {
          this.game.scoreManager.setScore('Best Time Alive', id, score);
        }
      }
    });
  }

  /* eslint-enable class-methods-use-this, no-unused-vars */

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    // Place them in the middle of the arena for now
    circle.x = this.centerx;
    circle.y = this.centery;

    circle.collisionGroup = playerObject.id;
  }

  // Called when an entity is respawned.
  onRespawn(entity) {
    // Move the entity close to the center
    entity.x = this.centerx;
    entity.y = this.centery;
  }

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.game.entityHandler.clear();
    this.game.respawnHandler.clean();
  }
}

export default Dodgebot;

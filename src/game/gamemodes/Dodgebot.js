import Gamemode from './Gamemode';
import Dangerbot from '../entities/Dangerbot';
import DangerbotController from '../entities/controllers/DangerbotController';
import BasicRectangle from '../entities/BasicRectangle';
import { HighscoreEnums } from '../configsystems/HighscoreSystem';

// How many walls the arena should have.
const WALLS = 4;

/*
  Dodgebot gamemode, get points by surviving for as long as possible.
*/
class Dodgebot extends Gamemode {
  constructor(game, resources) {
    super(game, resources);

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
      game.registerWall(wall);
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

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    // Place them in the middle of the arena for now
    circle.x = this.centerx;
    circle.y = this.centery;

    circle.collisionGroup = playerObject.id;
  }

  // Called when an entity is respawned.
  onPlayerRespawn(entity) {
    // Move the entity close to the center
    entity.x = this.centerx - 20 + Math.random() * 40;
    entity.y = this.centery - 20 + Math.random() * 40;
  }

  static getResources() {
    return [{ name: 'dangerbot', path: 'dangerbot/dangerbot2.png' }];
  }

  static getConfig() {
    return {
      joinPhase: 2,
      backgroundColor: 0x061639,
      moveWhilePhased: true,
      leave: {
        removeTime: 2,
      },
      respawn: {
        time: 1,
        phase: 1.5,
      },
      rules: ['Avoid the killer robots that try to kill you!'],
      abilities: [
        {
          name: 'Speed Boost',
          cooldown: 10,
          duration: 3,
          color: '#0099ff',
          activateFunc: (entity, resources) => {
            entity.vx *= 2;
            entity.vy *= 2;
          },
          deactivateFunc: (entity, resources) => {

          },
        },
      ],
      highscore: {
        order: HighscoreEnums.order.descending,
        scores: {
          Best_Time_Alive: {
            initial: 0,
            primary: true,
            display: HighscoreEnums.display.best('Time Alive'),
          },
          Time_Alive: {
            initial: 0,
            display: HighscoreEnums.display.time,
            events: [
              {
                trigger: HighscoreEnums.event.trigger.death,
                action: HighscoreEnums.event.action.reset,
              },
            ],
          },
          Deaths: {
            initial: 0,
            events: [
              {
                trigger: HighscoreEnums.event.trigger.death,
                action: HighscoreEnums.event.action.increment,
              },
            ],
          },
        },
      },
    };
  }
}

export default Dodgebot;

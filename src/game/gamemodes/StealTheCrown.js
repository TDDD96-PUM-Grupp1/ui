import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';
import BasicLine from '../entities/BasicLine';
import BasicRectangle from '../entities/BasicRectangle';
import { HighscoreEnums } from '../configsystems/HighscoreSystem';
/*
  Pass the bomb gamemode, get score by passing the bomb to other players
*/

let crown = null;

class StealTheCrown extends Gamemode {
  constructor(game, resources) {
    super(game, resources);

    const crownimg = new PIXI.Sprite(resources.crown);
    this.crownimg = crownimg;

    this.arenaRadius = 490;
    this.respawnArea = 100;
    this.time = 0;
    this.restTime = 0;

    // Center arena
    this.arenaCenterX = 0;
    this.arenaCenterY = 0;

    this.arenaSize = 700;
    this.centerx = 0;
    this.centery = 0;

    // Create arena
    this.topLine = this.addLine(-5000, 0, 5000, 0);
    this.bottomLine = this.addLine(-5000, 0, 5000, 0);
    this.rightLine = this.addLine(0, -500, 0, 500);
    this.leftLine = this.addLine(0, -500, 0, 500);

    this.crownEntity = this.createCrown();
  }

  // gameborders
  addLine(x, y, ex, ey) {
    const line = new BasicLine(this.game, x, y, ex, ey, 0x6633ff);
    line.staticFriction = 0;
    line.dynamicFriction = 0;
    line.restitution = 0.3;
    line.collisionGroup = 0;
    line.graphic.visible = false;
    this.game.registerWall(line);
    return line;
  }

  // Creates the invisible crownwearer
  createCrown() {
    const crownEntity = new BasicRectangle(
      this.game,
      60,
      72,
      0.01,
      this.game.app.renderer.backgroundColor
    );

    // gives first player hitting the invisible crownbearer the crown
    crownEntity.collision.addListener((object, victim) => {
      if (victim.isPlayer() && this.restTime > 0.5) {
        crown = victim;
        this.crownimg.scale.set(2.7, 3.2);
        this.crownimg.anchor.set(0.475, 0.47);
        crown.graphic.addChild(this.crownimg);
        this.restTime = 0;
        crownEntity.colliding = false;
      }
    });
    this.crownEntity = crownEntity;
    this.game.register(crownEntity);
    return crownEntity;
  }

  // Resets the invisible crownbearer
  addCrown() {
    this.crownEntity.rv = 0;
    this.crownEntity.vx = 0;
    this.crownEntity.vy = 0;
    this.crownEntity.rotation = 0;
    this.crownEntity.graphic.addChild(this.crownimg);
    this.crownimg.scale.set(0.3, 0.35);
    this.crownimg.anchor.set(0.475, 0.22);
    this.crownEntity.colliding = true;
    this.crownEntity.visible = true;

    // random number given, if null will spawn new crown
    crown = 5;
  }

  // Called before the game objects are updated
  preUpdate(dt) {
    this.time += dt;
    this.restTime += dt;
    // Spawns in a starting crown after 5s
    if (crown === null && this.time > 5) {
      this.addCrown();
      this.crownEntity.x = Math.random() * 1000 - 500;
      this.crownEntity.y = Math.random() * 400 - 200;
    } else if (crown !== null && crown.isPlayer) {
      // Gives a player score for having the crown, spawns a new one if the crowned player leaves
      if (crown.playerLeft) {
        this.crownEntity.x = crown.x;
        this.crownEntity.y = crown.y;
        crown.graphic.removeChild(this.crownimg);
        crown.die();
        this.addCrown();
      } else {
        const score = this.game.scoreManager.getScore('Time', crown.controller.id);
        this.game.scoreManager.setScore('Time', crown.controller.id, score + 1 / 60);
      }
    }
  }

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    // Adds the crownstealing mechanic between players
    const idTag = playerObject.id;
    circle.collision.addListener((player, victim) => {
      if (victim === crown && this.restTime > 0.5) {
        crown.graphic.removeChild(this.crownimg);
        crown = player;
        crown.graphic.addChild(this.crownimg);
        this.restTime = 0;
        const score = this.game.scoreManager.getScore('Steals', idTag);
        this.game.scoreManager.setScore('Steals', idTag, score + 1);
      }
    });

    // Place them in the middle of the arena for now
    circle.x = this.arenaCenterX;
    circle.y = this.arenaCenterY;
  }

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.arenaGraphic.destroy();
  }

  // Called when an entity is respawned.
  onPlayerRespawn(entity) {
    // Move the entity close to the center
    entity.x = this.arenaCenterX + Math.cos(Math.random() * Math.PI * 2) * this.respawnArea;
    entity.y = this.arenaCenterY + Math.sin(Math.random() * Math.PI * 2) * this.respawnArea;
  }

  onWindowResize() {
    // Updates the playing field to fit the window.

    const width = this.game.gameStageWidth * 0.5;
    const height = this.game.gameStageHeight * 0.5;
    this.topLine.y = -height;
    this.bottomLine.y = height;
    this.rightLine.x = width;
    this.leftLine.x = -width;

    // Puts a player back into the playing field if the window resizes
    Object.keys(this.players).forEach(id => {
      const entity = this.players[id];
      if (entity.x < -width) {
        entity.x = -width + entity.radius;
      } else if (entity.x > width) {
        entity.x = width - entity.radius;
      }
      if (entity.y < -height) {
        entity.y = -height + entity.radius;
      } else if (entity.y > height) {
        entity.y = height - entity.radius;
      }
    });
  }

  static getResources() {
    return [{ name: 'crown', path: 'passthe/crown.png' }];
  }

  static getConfig() {
    return {
      joinPhase: 2,
      playerRadius: 32,
      backgroundColor: 0x061639,
      leave: {
        // If a player has the bomb then the bomb must pop before they are removed
        removeTime: 5,
      },
      respawn: {
        time: 1,
        phase: 2,
      },
      rules: [
        'Steal the crown! Hold it to get points, and steal it from whoever currently carries it!',
      ],
      highscore: {
        order: HighscoreEnums.order.descending,
        scores: {
          Time: {
            initial: 0,
            primary: true,
          },
          Steals: {
            initial: 0,
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
          Latency: { initial: '- ms', display: HighscoreEnums.display.latency },
        },
      },
    };
  }
}

export default StealTheCrown;

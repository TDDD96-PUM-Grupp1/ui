import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';
import BasicLine from '../entities/BasicLine';
import { HighscoreEnums } from '../configsystems/HighscoreSystem';
/*
  Pass the bomb gamemode, get score by passing the bomb to other players
*/

let BOMB = null;
let Bombset = false;
let bombTimer = 5;
let bombExploded = false;

class PassTheBomb extends Gamemode {
  constructor(game, resources) {
    super(game, resources);

    // Creare bombcounter
    this.bombtext = new PIXI.Text(bombTimer, {
      fontFamily: 'Arial',
      fontSize: 30,
      fill: 0xffffff,
      align: 'center',
      strokeThickness: 5,
    });
    this.bombtext.scale.set(10, 10);

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
  }

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

  // Called before the game objects are updated
  preUpdate(dt) {
    this.time += dt;
    this.restTime += dt;

    // Sets up the bomb amongst eligible players
    if (BOMB === null) {
      const players = this.game.entityHandler.getPlayers();
      const eligible = [];
      players.forEach(player => {
        if (!player.phasing && !player.dead && !player.playerLeft) {
          eligible.push(player);
        }
      });
      let player;
      if (eligible.length > 1 && this.time > 5) {
        player = eligible[Math.floor(Math.random() * eligible.length)];
        BOMB = player;
        this.time = 0;
      }
    }
    // Sets the timer on the bombplayer
    if (BOMB !== null && !Bombset) {
      BOMB.graphic.addChild(this.bombtext);
      this.bombtext.x = -100;
      this.bombtext.y = -100;
      Bombset = true;
    }
    // Makes the bomb tick and explodes if timer has run out
    if (Bombset) {
      bombTimer -= dt;
      this.bombtext.text = Math.ceil(bombTimer);
      if (BOMB.playerLeft) {
        BOMB.graphic.removeChild(this.bombtext);

        if (!BOMB.dead) {
          BOMB.die();
        }
        BOMB = null;
        this.time = 0;
        bombTimer = 5;
        Bombset = false;
        bombExploded = true;
      }
      if (bombTimer < 0) {
        BOMB.graphic.removeChild(this.bombtext);
        BOMB.die();
        Bombset = false;
        BOMB = null;
        this.time = 0;
        bombTimer = 5;
        bombExploded = true;
      }
    }
  }

  // Called after the game objects are updated.
  postUpdate() {
    // Updates the scoreboard when the bomb explodes
    if (bombExploded) {
      Object.keys(this.players).forEach(id => {
        const entity = this.players[id];
        if (!entity.playerLeft && !entity.dead) {
          const score = this.game.scoreManager.getScore('Score', id);
          this.game.scoreManager.setScore('Score', id, score + 1);
        }
      });
      bombExploded = false;
    }
  }

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    // Adds the bomblistener to the players
    circle.collision.addListener((player, victim) => {
      if (!player.playerLeft && victim === BOMB && this.restTime > 0.5) {
        BOMB.graphic.removeChild(this.bombtext);
        BOMB = player;
        BOMB.graphic.addChild(this.bombtext);
        this.restTime = 0;
        bombTimer = Math.ceil(bombTimer);
        const score = this.game.scoreManager.getScore('Passes', victim.controller.id);
        this.game.scoreManager.setScore('Passes', victim.controller.id, score + 1);
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
    // Updates the playing field to fit the window. Might be a better way to do this.

    const width = this.game.gameStageWidth * 0.5;
    const height = this.game.gameStageHeight * 0.5;
    this.topLine.y = -height;
    this.bottomLine.y = height;
    this.rightLine.x = width;
    this.leftLine.x = -width;

    // Puts a player back into the playing field if the window resizes
    Object.keys(this.players).forEach(id => {
      const entity = this.players[id];
      if (!entity.playerLeft) {
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
      } else if (!entity.dead) {
        if (entity === BOMB) {
          BOMB.graphic.removeChild(this.bombtext);
          BOMB.die();
          Bombset = false;
          BOMB = null;
          this.time = 0;
          bombTimer = 5;
          bombExploded = true;
        } else entity.die();
      }
    });
  }

  static getConfig() {
    return {
      joinPhase: 2,
      playerRadius: 32,
      backgroundColor: 0x061639,
      leave: {
        // If a player has the bomb then the bomb must pop before they are removed

        removeTime: bombTimer + 0.1,
      },
      respawn: {
        time: 1,
        phase: 2,
      },
      rules: ['Avoid the bomb! If you are unlucky try to pass the bomb to a foe!'],
      abilities: [
        {
          name: 'Speed Boost',
          cooldown: 10,
          duration: 3,
          color: '#0099ff',
          activateFunc: entity => {
            entity.vx *= 2;
            entity.vy *= 2;
          },
          deactivateFunc: () => {},
        },
      ],
      highscore: {
        order: HighscoreEnums.order.descending,
        scores: {
          Score: {
            initial: 0,
            primary: true,
          },
          Passes: {
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

export default PassTheBomb;

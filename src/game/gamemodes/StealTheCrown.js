import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';
import BasicLine from '../entities/BasicLine';
import BasicRectangle from '../entities/BasicRectangle';
import { HighscoreEnums } from '../configsystems/HighscoreSystem';
import CollisionCircle from '../entities/collision/CollisionCircle';
/*
  Pass the bomb gamemode, get score by passing the bomb to other players
*/

let crown = null;
let crownTime = 0;

class StealTheCrown extends Gamemode {
  constructor(game, resources) {
    super(game, resources);

    const crownimg = new PIXI.Sprite(resources.crown);
    //crownimg.width = 3200 * 2;
    //´´crownimg.height = 3200 * 2;
    crownimg.scale.set(2.7,3.2);
    crownimg.anchor.set(0.475, 0.47);
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
  addCrown(width,height,mass,color){
    const crownEntity = new BasicRectangle(this.game,width,height,mass,color);
    crownEntity.staticFriction = 0;
    crownEntity.dynamicFriction = 0;
    //crownEntity.collisionGroup = 0;
    const graphic = new PIXI.Sprite(this.resources.crown);
    graphic.scale.set(0.45,0.5);
    graphic.anchor.set(0.475, 0.47);
    crownEntity.graphic.addChild(graphic);


    this.collision = new CollisionCircle(42);
    this.collision.setEntity(crownEntity);
    this.collision.addListener((crownEntity, victim) => {
      console.log(crownEntity);
      if (victim.isPlayer()) {
        crown = victim;
        crown.graphic.addChild(this.crownimg);
      }
    });
        this.game.register(crownEntity);
    return crownEntity;
  }

  // Called before the game objects are updated
  preUpdate(dt) {
    this.time += dt;
    this.restTime += dt;
    if (crown === null)
    {
      const crownEntity = this.addCrown(50,50,Infinity,0xffffff);
      crownEntity.x = 500;
      crownEntity.y = 50;
      crown = 5;


      //Give crown to random player
      /*
      const players = this.game.entityHandler.getPlayers();
      const eligible = [];
      players.forEach(player => {
        if (!player.phasing && !player.dead) {
          eligible.push(player);
        }
      });
      let player;
      if (eligible.length > 1 && this.time > 5) {
        player = eligible[Math.floor(Math.random() * eligible.length)];
        crown = player;
        this.time = 0;
      }*/
    }
    else if(crown.isPlayer)
    {
        const score = this.game.scoreManager.getScore('Time', crown.controller.id);

        this.game.scoreManager.setScore('Time', crown.controller.id, score + 1/60);
    }

  }

  // Called after the game objects are updated.
  postUpdate() {
    // Updates the scoreboard when the bomb explodes

  }

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    // Adds the bomblistener to the players
    const idTag = playerObject.id;
    circle.collision.addListener((player, victim) => {

      if (victim === crown && this.restTime > 0.5) {
        crown.graphic.removeChild(this.crownimg);
        crown = player;
        crown.graphic.addChild(this.crownimg);
        this.restTime = 0;
        crownTime = Math.ceil(crownTime);
        const score = this.game.scoreManager.getScore('Steals', idTag);
        this.game.scoreManager.setScore('Steals', idTag, score + 1);
        this.time = 0;
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
      respawn: {
        time: 1,
        phase: 2,
      },
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

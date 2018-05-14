import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';
import BasicLine from '../entities/BasicLine';
/*
  Pass the bomb gamemode, get score by passing the bomb to other players.
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
    this.resttime = 0;

    // Center arena
    this.arenaCenterx = 0;
    this.arenaCentery = 0;

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

  /* eslint-disable no-unused-vars, class-methods-use-this */

  // Called before the game objects are updated.
  preUpdate(dt) {
    this.time += dt;
    this.resttime += dt;

    // Sets up the bomb amongst eligible players
    if (BOMB === null) {
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
  postUpdate(dt) {
    // Updates the scoreboard when the bomb explodes
    if (bombExploded) {
      Object.keys(this.players).forEach(id => {
        const entity = this.players[id];
        if (!entity.dead) {
          const score = this.game.scoreManager.getScore('Times Avoided Death', id);
          this.game.scoreManager.setScore('Times Avoided Death', id, score + 1);
        }
      });
      bombExploded = false;
    }
  }

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    // Adds the bomblistener to the players
    const { iconID } = playerObject;
    const idTag = playerObject.id;
    circle.collision.addListener((player, victim) => {
      if (player === BOMB && victim.isPlayer() && this.resttime > 0.5) {
        BOMB.graphic.removeChild(this.bombtext);
        BOMB = victim;
        BOMB.graphic.addChild(this.bombtext);
        this.resttime = 0;
        bombTimer = Math.ceil(bombTimer);
        const score = this.game.scoreManager.getScore('Bomb Passes', idTag);
        this.game.scoreManager.setScore('Bomb Passes', idTag, score + 1);
      } else if (victim === BOMB && this.resttime > 0.5) {
        BOMB.graphic.removeChild(this.bombtext);
        BOMB = player;
        BOMB.graphic.addChild(this.bombtext);
        this.resttime = 0;
        bombTimer = Math.ceil(bombTimer);
        const score = this.game.scoreManager.getScore('Bomb Passes', victim.controller.id);
        this.game.scoreManager.setScore('Bomb Passes', victim.controller.id, score + 1);
      }
    });

    // Place them in the middle of the arena for now
    circle.x = this.arenaCenterx;
    circle.y = this.arenaCentery;
  }

  // Called when a player disconnects
  onPlayerLeave(idTag) {}

  onButtonPressed(id, button) {}

  /* eslint-enable class-methods-use-this, no-unused-vars */

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.arenaGraphic.destroy();
  }

  // Called when an entity is respawned.
  onRespawn(entity) {
    // Move the entity close to the center
    entity.x = this.arenaCenterx + Math.cos(Math.random() * Math.PI * 2) * this.respawnArea;
    entity.y = this.arenaCentery + Math.sin(Math.random() * Math.PI * 2) * this.respawnArea;
  }

  // Called when an entity dies.
  // eslint-disable-next-line
  onDeath(entity) {}

  // eslint-disable-next-line
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
      if (entity.x < 0) {
        entity.x = entity.radius;
      } else if (entity.x > window.innerWidth) {
        entity.x = window.innerWidth - entity.radius;
      }
      if (entity.y < 0) {
        entity.y = entity.radius;
      } else if (entity.y > window.innerHeight) entity.y = window.innerHeight - entity.radius;
    });
  }
}

export default PassTheBomb;

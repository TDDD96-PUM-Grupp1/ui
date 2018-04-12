import * as PIXI from 'pixi.js';
import PlayerCircle from '../entities/PlayerCircle';
import Gamemode from './Gamemode';
// import TestController from '../entities/controllers/TestController';
import PlayerController from '../entities/controllers/PlayerController';
import LocalPlayerController from '../entities/controllers/LocalPlayerController';

import RespawnHandler from './RespawnHandler';

// Respawn time in seconds
const RESPAWN_TIME = 3;

/*
  Knock off gamemode, get score by knocking other players off the arena.
*/
class KnockOff extends Gamemode {
  constructor(game) {
    super(game);

    this.players = {};
    this.score = {};
    this.tags = {};

    this.arenaRadius = 350;
    this.arenaCenterx = 500;
    this.arenaCentery = 500;

    // Set up arena graphic
    const graphic = new PIXI.Graphics();
    graphic.beginFill(0xfffffff);
    graphic.drawCircle(0, 0, this.arenaRadius);
    graphic.endFill();
    game.app.stage.addChildAt(graphic, 0);
    graphic.tint = 0x555555;
    graphic.x = this.arenaCenterx;
    graphic.y = this.arenaCentery;
    this.arenaGraphic = graphic;

    // TODO remove
    const circle3 = new PlayerCircle(this.game.app);
    const controller3 = new LocalPlayerController(1);
    circle3.setController(controller3);
    circle3.x = 400;
    circle3.y = 400;
    circle3.setColor(0xee6666);
    circle3.setEntityListener(this);
    this.game.entityHandler.register(circle3);

    this.respawnHandler = new RespawnHandler(this.game.entityHandler, RESPAWN_TIME);

    this.respawnHandler.registerRespawnListener(this);
  }

  /* eslint-disable no-unused-vars, class-methods-use-this */
  // Called before the game objects are updated.
  preUpdate(dt) {
    // Update tags
    Object.keys(this.tags).forEach(id => {
      const list = this.tags[id];
      while (list.length > 0) {
        list[0].timer -= dt;
        if (list[0].timer <= 0) {
          // Remove expired tag
          list.shift();
        }
      }
      list.forEach(item => {
        item.timer -= dt;
      });
    });
    this.respawnHandler.checkRespawns();
  }
  /* eslint-enable no-unused-vars, class-methods-use-this */

  /* eslint-disable class-methods-use-this, no-unused-vars */

  // Called after the game objects are updated.
  postUpdate(dt) {
    this.game.entityHandler.getEntities().forEach(entity => {
      const dx = this.arenaCenterx - entity.x;
      const dy = this.arenaCentery - entity.y;
      const centerDist = Math.sqrt(dx * dx + dy * dy);

      if (centerDist > this.arenaRadius) {
        entity.die();
      }
    });
  }

  // Called when a new player connects
  onPlayerJoin(idTag) {
    console.log('Player join');
    const circle = new PlayerCircle(this.game.app);
    const controller = new PlayerController(this.game, idTag);
    circle.setController(controller);
    // Place them in the middle of the arena for now
    circle.x = 500;
    circle.y = 500;
    circle.setColor(0xff3333);
    this.game.entityHandler.register(circle);

    circle.setEntityListener(this);

    this.players[idTag] = circle;
    this.score[idTag] = 0;
    circle.setDeathListener(entity => {
      const { id } = entity.controller;
      // this.score[id] -= 1;
      this.tags[id].forEach(item => {
        this.score[item.id] += 1;
      });
    });
    circle.collision.addListener((player, victim) => {
      // Check if victim is a player
      if (victim.id !== undefined) {
        this.tags[victim.id].push({ id: player.id, timer: 4 });
        this.tags[player.id].push({ id: victim.id, timer: 4 });
      }
    });
  }

  // Called when a player disconnects
  onPlayerLeave(idTag) {
    // When a player leaves, just leave their entity on the map.
    // this.players[idTag].setController(null);
  }

  /* eslint-enable class-methods-use-this, no-unused-vars */

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.game.entityHandler.clear();
  }

  // Respawn entities by registering them in the entityHandler.
  onRespawn(entity) {
    console.log('Player respawn');
    entity.x = 400;
    entity.y = 400;
    entity.graphic.visible = true;
    this.game.entityHandler.register(entity);
  }

  /* eslint-disable class-methods-use-this */
  // Gets called when entity dies.
  onDeath(entity) {
    console.log('Player died');

    const deathTime = new Date();

    this.respawnHandler.registerDeath(entity, deathTime);
  }
}

export default KnockOff;

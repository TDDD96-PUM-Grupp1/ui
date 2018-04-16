/* eslint-disable prettier/prettier */
import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';
import HighscoreList from '../entities/HighscoreList';

// Respawn time in seconds
const RESPAWN_TIME = 3;

// The max time between a collision and a player dying in order to count as a kill.
const TAG_TIME = 4;

/*
  Knock off gamemode, get score by knocking other players off the arena.
*/
class KnockOff extends Gamemode {
  constructor(game) {
    super(game);

    this.players = {};
    this.respawn = {};
    this.tags = {};

    this.game.respawnHandler.registerRespawnListener(this);

    this.arenaRadius = 350;

    // Center arena
    this.arenaCenterx = Math.round(window.innerWidth / 2);
    this.arenaCentery = Math.round(window.innerHeight / 2);

    // Set up arena graphic
    const graphic = new PIXI.Graphics();
    graphic.beginFill(0xfffffff);
    this.mainCircle = graphic.drawCircle(0, 0, this.arenaRadius);
    graphic.endFill();
    game.app.stage.addChildAt(graphic, 0); // Set arena to be first thing to render
    graphic.tint = 0x555555;
    graphic.x = this.arenaCenterx;
    graphic.y = this.arenaCentery;
    this.arenaGraphic = graphic;

    // Set up scores
    game.scoreManager.addScoreType('Kills', 0, true);
    game.scoreManager.addScoreType('Deaths', 0);
    game.scoreManager.setAscOrder(false);
    this.hs_list = new HighscoreList(game.scoreManager, game);
  }

  /* eslint-disable no-unused-vars, class-methods-use-this */

  // Called before the game objects are updated.
  preUpdate(dt) {
    // Update tags
    Object.keys(this.tags).forEach(id => {
      const list = this.tags[id];
      while (list.length > 0) {
        if (list[0].timer - dt <= 0) {
          // Remove expired tag
          list.shift();
        } else {
          break;
        }
      }
      list.forEach(item => {
        item.timer -= dt;
      });
    });
  }

  /* eslint-enable no-unused-vars, class-methods-use-this */

  /* eslint-disable class-methods-use-this, no-unused-vars */

  // Called after the game objects are updated.
  postUpdate(dt) {
    this.game.entityHandler.getEntities().forEach(entity => {
      if (entity.isPlayer()) {
        const dx = this.arenaGraphic.x - entity.x;
        const dy = this.arenaGraphic.y - entity.y;
        const centerDist = Math.sqrt(dx * dx + dy * dy);

        if (centerDist > this.arenaRadius - entity.radius) {
          entity.die();
        }
      }
    });
  }

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    const { iconID } = playerObject;
    const idTag = playerObject.id;

    // Place them in the middle of the arena for now
    circle.x = this.arenaCenterx;
    circle.y = this.arenaCentery;
    circle.setColor(0xff3333);
    this.game.entityHandler.register(circle);

    this.players[idTag] = circle;
    this.tags[idTag] = [];
    this.respawn[idTag] = true;

    circle.addEntityListener(this);

    circle.collision.addListener((player, victim) => {
      // Check if victim is a player
      if (victim.controller && victim.controller.id !== undefined) {
        const vid = victim.controller.id;
        const pid = player.controller.id;
        this.tags[vid] = this.tags[vid].filter(e => e.id !== pid);
        this.tags[vid].push({ id: pid, timer: TAG_TIME });
        this.tags[pid] = this.tags[pid].filter(e => e.id !== vid);
        this.tags[pid].push({ id: vid, timer: TAG_TIME });
      }
    });
  }

  // Called when a player disconnects
  onPlayerLeave(idTag) {
    // When a player leaves, just leave their entity on the map.
    // But stop them from respawning.
    this.respawn[idTag] = false;
  }

  /* eslint-enable class-methods-use-this, no-unused-vars */

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.game.entityHandler.clear();
    // TODO: Clear respawns
    // this.game.respawnHandler.clear();
  }

  // Called when an entity is respawned.
  onRespawn(entity) {
    // Move the entity to the center
    entity.x = this.arenaCenterx;
    entity.y = this.arenaCentery;
    // TODO: randomize a bit
  }

  // Called when an entity dies.
  onDeath(entity) {
    const { id } = entity.controller;
    this.tags[id].forEach(item => {
      // console.log("%s killed %s", item.id, id);
      this.game.scoreManager.addScore('Kills', item.id, 1);
    });

    this.game.scoreManager.addScore('Deaths', id, 1);

    if (this.respawn[id]) {
      this.game.respawnHandler.addRespawn(entity, RESPAWN_TIME);
    } else {
      this.game.entityHandler.unregisterFully(entity);
    }
  }

  onWindowResize() {
    const newCenterX = Math.round(window.innerWidth / 2);
    const newCenterY = Math.round(window.innerHeight / 2);

    // Calculate diff in x and y before moving everything
    const dx = this.arenaGraphic.x - newCenterX;
    const dy = this.arenaGraphic.y - newCenterY;

    this.arenaGraphic.x = newCenterX;
    this.arenaGraphic.y = newCenterY;

    this.game.entityHandler.getEntities().forEach(entity => {
      entity.x -= dx;
      entity.y -= dy;
    });
  }

  /* eslint-disable class-methods-use-this */
}

export default KnockOff;

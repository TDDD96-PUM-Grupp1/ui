import * as PIXI from 'pixi.js';
import { GlowFilter } from 'pixi-filters';
import Gamemode from './Gamemode';

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
    this.score = {};
    this.tags = {};

    this.game.respawnHandler.registerRespawnListener(this);

    this.arenaRadius = 350;
    this.arenaCenterx = 500;
    this.arenaCentery = 500;

    // Set up arena graphic
    const graphic = new PIXI.Graphics();
    graphic.beginFill(0x444444);
    graphic.drawCircle(0, 0, this.arenaRadius);
    graphic.endFill();
    game.app.stage.addChildAt(graphic, 0); // Set arena to be first thing to render
    graphic.tint = 0xffffff;
    graphic.x = this.arenaCenterx;
    graphic.y = this.arenaCentery;
    this.arenaGraphic = graphic;

    const border = new PIXI.Graphics();
    border.lineStyle(5, 0x220000);
    border.drawCircle(0, 0, this.arenaRadius + 2);
    border.endFill();
    game.app.stage.addChildAt(border, 1);
    border.x = this.arenaCenterx;
    border.y = this.arenaCentery;
    border.filterArea = new PIXI.Rectangle(100, 100, 800, 800);
    border.filters = [new GlowFilter(10, 3, 3, 0xff0101, 0.3)];
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
        const dx = this.arenaCenterx - entity.x;
        const dy = this.arenaCentery - entity.y;
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
    this.score[idTag] = 0;
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
      this.score[item.id] += 1;
    });

    if (this.respawn[id]) {
      this.game.respawnHandler.addRespawn(entity, RESPAWN_TIME);
    } else {
      this.game.entityHandler.unregisterFully(entity);
    }
  }

  /* eslint-disable class-methods-use-this */
}

export default KnockOff;

import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';
import HighscoreList from '../HighscoreList';

// Respawn time in seconds
const RESPAWN_TIME = 1;

// The max time between a collision and a player dying in order to count as a kill.
const TAG_TIME = 4;

// Ability times
const ABILITY_COOLDOWN = 10;
const ABILITY_DURATION = 3;

/*
  Knock off gamemode, get score by knocking other players off the arena.
*/
class KnockOff extends Gamemode {
  constructor(game, resources) {
    super(game, resources);

    this.players = {};
    this.tags = {};
    this.abilityTimer = {};

    this.game.respawnHandler.registerRespawnListener(this);

    this.arenaRadius = 490;
    this.respawnArea = 100;

    // Center arena
    this.arenaCenterx = Math.round(window.innerWidth / 2);
    this.arenaCentery = Math.round(window.innerHeight / 2);

    // Set up arena graphic
    const graphic = new PIXI.Sprite(resources.arena);
    game.app.stage.addChildAt(graphic, 0);
    this.arenaGraphic = graphic;

    const border = new PIXI.Graphics();
    border.lineStyle(5, 0xff0101);
    border.drawCircle(0, 0, graphic.width * 0.5 + 2);
    border.endFill();
    graphic.addChild(border);

    graphic.width = this.arenaRadius * 2;
    graphic.height = this.arenaRadius * 2;
    graphic.anchor.set(0.5, 0.5);
    graphic.x = this.arenaCenterx;
    graphic.y = this.arenaCentery;

    // Set up scores
    game.scoreManager.addScoreType('Kills', 0, true);
    game.scoreManager.addScoreType('Deaths', 0);
    game.scoreManager.addScoreType('Latency', '- ms');
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
    }, this);

    Object.keys(this.abilityTimer).forEach(id => {
      this.abilityTimer[id].time -= dt;
      if (
        this.abilityTimer[id].active &&
        this.abilityTimer[id].time <= ABILITY_COOLDOWN - ABILITY_DURATION
      ) {
        this.players[id].mass = 1;
        // eslint-disable-next-line
        this.players[id].setColor(0xffffff ^ this.players[id].graphic.tint);
        this.abilityTimer[id].active = false;
      }
    }, this);
  }

  /* eslint-enable no-unused-vars, class-methods-use-this */

  /* eslint-disable class-methods-use-this, no-unused-vars */

  // Called after the game objects are updated.
  postUpdate(dt) {
    this.game.entityHandler.getPlayers().forEach(entity => {
      if (!entity.dead) {
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

    this.game.register(circle);
    circle.collisionGroup = idTag;

    circle.phase(3);

    this.players[idTag] = circle;
    this.tags[idTag] = [];
    this.abilityTimer[idTag] = { active: false, time: 0 };

    circle.addEntityListener(this);

    circle.collision.addListener((player, victim) => {
      // Check if victim is a player
      if (victim.isPlayer()) {
        const vid = victim.controller.id;
        const pid = player.controller.id;
        this.tags[vid] = this.tags[vid].filter(e => e.id !== pid);
        this.tags[vid].push({ id: pid, timer: TAG_TIME });
        // Since this function is activated for both players
        // we should only need to update tags on the victim
        // and the "player" should be tagged by the twin call.
        // this.tags[pid] = this.tags[pid].filter(e => e.id !== vid);
        // this.tags[pid].push({ id: vid, timer: TAG_TIME });
      }
    });
  }

  // Called when a player disconnects
  onPlayerLeave(idTag) {
    // Turn the players entity into a dummy, leaving it in the game until it dies
    this.players[idTag].ownerLeft();
  }

  onButtonPressed(id, button) {
    const playerEntity = this.players[id];
    if (this.abilityTimer[id].time <= 0) {
      playerEntity.mass *= 50;
      /* eslint-disable-next-line */
      this.players[id].setColor(0xffffff ^ this.players[id].graphic.tint);
      this.abilityTimer[id].time = ABILITY_COOLDOWN;
      this.abilityTimer[id].active = true;
    }
  }

  /* eslint-enable class-methods-use-this, no-unused-vars */

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.game.entityHandler.clear();
    this.game.respawnHandler.clean();
  }

  // Called when an entity is respawned.
  onRespawn(entity) {
    // Move the entity close to the center
    entity.x = this.arenaCenterx + Math.cos(Math.random() * Math.PI * 2) * this.respawnArea;
    entity.y = this.arenaCentery + Math.sin(Math.random() * Math.PI * 2) * this.respawnArea;

    // Phase the entity for a bit
    entity.phase(2);
  }

  // Called when an entity dies.
  onDeath(entity) {
    const { id } = entity.controller;
    this.tags[id].forEach(item => {
      // console.log("%s killed %s", item.id, id);
      this.game.scoreManager.addScore('Kills', item.id, 1);
    });

    this.game.scoreManager.addScore('Deaths', id, 1);

    if (entity.playerLeft) {
      this.game.entityHandler.unregisterFully(entity);
    } else {
      this.game.respawnHandler.addRespawn(entity, RESPAWN_TIME);
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

    this.arenaCenterx = newCenterX;
    this.arenaCentery = newCenterY;

    this.game.entityHandler.getEntities().forEach(entity => {
      entity.x -= dx;
      entity.y -= dy;
    });
  }

  /* eslint-disable class-methods-use-this */
}

export default KnockOff;

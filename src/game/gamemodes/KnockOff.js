import * as PIXI from 'pixi.js';
import PlayerCircle from '../entities/PlayerCircle';
import Gamemode from './Gamemode';
// import TestController from '../entities/controllers/TestController';
import PlayerController from '../entities/controllers/PlayerController';
// import LocalPlayerController from '../entities/controllers/LocalPlayerController';
import iconData from '../iconData';

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
    graphic.beginFill(0xfffffff);
    graphic.drawCircle(0, 0, this.arenaRadius);
    graphic.endFill();
    game.app.stage.addChildAt(graphic, 0); // Set arena to be first thing to render
    graphic.tint = 0x555555;
    graphic.x = this.arenaCenterx;
    graphic.y = this.arenaCentery;
    this.arenaGraphic = graphic;

    // TODO remove
    // this.onPlayerJoin(1, 1, () => {
    //   const fakePlayer = this.players[1];
    //   fakePlayer.setController(new LocalPlayerController(1));
    //   fakePlayer.setColor(0xee6666);
    //   fakePlayer.y = 300;
    // });

    /*

    this.onPlayerJoin(2);
    fakePlayer = this.players[2];
    fakePlayer.setColor(0xeeff66);
    fakePlayer.x = 600;
    fakePlayer.y = 300; */

    /* this.game.resourceServer
      .requestResources([{ name: iconData[5].name, path: iconData[5].img }])
      .then(resources => {
        const circle3 = new PlayerCircle(this.game.app, resources[iconData[5].name]);
        const controller3 = new LocalPlayerController(1);
        circle3.setController(controller3);
        circle3.x = 500;
        circle3.y = 500;
        circle3.setColor(0xee6666);
        circle3.setEntityListener(this);
        this.game.entityHandler.register(circle3);
      }); */
  }

  /* eslint-disable no-unused-vars, class-methods-use-this */
  // Called before the game objects are updated.
  preUpdate(dt) {
    this.arenaRadius--;

    this.arenaGraphic.beginFill(0xfffffff);
    this.arenaGraphic.drawCircle(0, 0, this.arenaRadius);
    this.arenaGraphic.endFill();
    this.arenaGraphic.tint = 0x555555;
    this.arenaGraphic.x = this.arenaCenterx;
    this.arenaGraphic.y = this.arenaCentery;

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

  // Called when a new player connects
  onPlayerJoin(playerObject) {
    // console.log('Player join');

    const { iconID } = playerObject;
    const idTag = playerObject.id;

    this.game.resourceServer
      .requestResources([{ name: iconData[iconID].name, path: iconData[iconID].img }])
      .then(resources => {
        const circle = new PlayerCircle(this.game.app, resources[iconData[iconID].name]);
        const controller = new PlayerController(this.game, idTag);
        circle.setController(controller);
        // Place them in the middle of the arena for now
        circle.x = 500;
        circle.y = 500;
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

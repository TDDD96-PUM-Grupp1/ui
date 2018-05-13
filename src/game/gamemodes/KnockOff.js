import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';

// TODO: Sync these with HighscoreSystem somehow
/* eslint-disable no-unused-vars */
const EVENT_TRIGGER_DEATH = 0;
const EVENT_TRIGGER_KILL = 1;

const EVENT_ACTION_RESET = 0;
const EVENT_ACTION_INCREMENT = 1;
const EVENT_ACTION_DECREMENT = 2;

const HIGHSCORE_ORDER_ASCENDING = true;
const HIGHSCORE_ORDER_DESCENDING = false;

const HIGHSCORE_DISPLAY_TIME = 0;
const HIGHSCORE_DISPLAY_LATENCY = 1;
const HIGHSCORE_DISPLAY_BEST = name => ({ type: 'best', target: name });
/* eslint-enable no-unused-vars */

/*
  Knock off gamemode, get score by knocking other players off the arena.
*/
class KnockOff extends Gamemode {
  constructor(game, resources) {
    super(game, resources);
    this.game.respawnHandler.registerRespawnListener(this);

    this.arenaRadius = 400;
    this.respawnArea = 100;

    this.scaleHeight = this.arenaRadius * 2 + 50;

    // Set up arena graphic
    const graphic = new PIXI.Sprite(resources.arena);
    game.gameStage.addChildAt(graphic, 0);
    this.arenaGraphic = graphic;

    const border = new PIXI.Graphics();
    border.lineStyle(5, 0xff0101);
    border.drawCircle(0, 0, graphic.width * 0.5 + 2);
    border.endFill();
    graphic.addChild(border);

    graphic.width = this.arenaRadius * 2;
    graphic.height = this.arenaRadius * 2;
    graphic.anchor.set(0.5, 0.5);
    graphic.x = 0;
    graphic.y = 0;
  }

  /* eslint-disable no-unused-vars, class-methods-use-this */

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

  /* eslint-enable no-unused-vars, class-methods-use-this */

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    // Place them in the middle of the arena for now
    circle.x = this.arenaGraphic.x;
    circle.y = this.arenaGraphic.y;
  }

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.arenaGraphic.destroy();
  }

  // Called when an entity is respawned.
  onRespawn(entity) {
    // Move the entity close to the center
    entity.x = this.arenaGraphic.x + Math.cos(Math.random() * Math.PI * 2) * this.respawnArea;
    entity.y = this.arenaGraphic.y + Math.sin(Math.random() * Math.PI * 2) * this.respawnArea;
  }

  static getResources() {
    return [
      { name: 'arena', path: 'knockoff/arena.png' },
      { name: 'ability', path: 'knockoff/circle_activate5.png' },
    ];
  }

  static getConfig() {
    return {
      joinPhase: 2,
      playerRadius: 32,
      backgroundColor: 0x061639,
      abilities: [
        {
          name: 'Super Heavy',
          cooldown: 10,
          duration: 3,
          color: '#ff0000',
          activateFunc: (entity, resources) => {
            entity.mass *= 50;
            resources.baseCircle = entity.graphic.texture;
            entity.graphic.texture = resources.ability;
          },
          deactivateFunc: (entity, resources) => {
            entity.mass /= 50;
            entity.graphic.texture = resources.baseCircle;
          },
        },
      ],
      kill: {
        tag: {
          tagTime: 1.5,
        },
      },
      respawn: {
        time: 1,
        phase: 2,
      },
      highscore: {
        order: HIGHSCORE_ORDER_DESCENDING,
        scores: {
          Kills: {
            initial: 0,
            primary: true,
            events: [{ trigger: EVENT_TRIGGER_KILL, action: EVENT_ACTION_INCREMENT }],
          },
          Deaths: {
            initial: 0,
            events: [{ trigger: EVENT_TRIGGER_DEATH, action: EVENT_ACTION_INCREMENT }],
          },
          Latency: { initial: '- ms', display: HIGHSCORE_DISPLAY_LATENCY },
        },
      },
    };
  }
}

export default KnockOff;

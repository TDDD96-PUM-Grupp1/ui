import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';
import { HighscoreEnums } from '../configsystems/HighscoreSystem';

/*
  Knock off gamemode, get score by knocking other players off the arena.
*/
class KnockOff extends Gamemode {
  constructor(game, resources) {
    super(game, resources);

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
    this.onPlayerRespawn(circle);
  }

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.arenaGraphic.destroy();
  }

  // Called when an entity is respawned.
  onPlayerRespawn(entity) {
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
      rules: [
        'Knock the players off the arena!',
        'Abillities:',
        'SuperHeavy - Become super heavy and knock your enemies with an extreme force!',
      ],
      leave: {
        removeTime: 2,
      },
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
        order: HighscoreEnums.order.descending,
        scores: {
          Kills: {
            initial: 0,
            primary: true,
            events: [
              {
                trigger: HighscoreEnums.event.trigger.kill,
                action: HighscoreEnums.event.action.increment,
              },
            ],
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

export default KnockOff;

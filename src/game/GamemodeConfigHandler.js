import GamemodeConfig from './GamemodeConfig';
import TestGamemode from './gamemodes/TestGamemode';
import KnockOff from './gamemodes/KnockOff';
import KnockOffRandom from './gamemodes/KnockOffRandom';
import KnockOffDynamic from './gamemodes/KnockOffDynamic';
import KnockOffWander from './gamemodes/KnockOffWander';
import Dodgebot from './gamemodes/Dodgebot';

import HighscoreList from './HighscoreList';
import PlayerCircle from './entities/PlayerCircle';
import PlayerController from './entities/controllers/PlayerController';
import iconData from './iconData';

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

class GamemodeConfigList {
  constructor() {
    this.gamemodes = {};
    this.configs = {};
    this.loadConfig();
  }

  getConfig(Gamemode) {
    return this.configs[Gamemode.name];
  }

  loadConfig() {
    this.addGamemode(
      KnockOff,
      {
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
              // entity.graphic.tint ^= 0xffffff;
            },
            deactivateFunc: (entity, resources) => {
              entity.mass /= 50;
              entity.graphic.texture = resources.baseCircle;
              // entity.graphic.tint ^= 0xffffff;
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
      },
      [
        { name: 'arena', path: 'knockoff/arena.png' },
        { name: 'ability', path: 'knockoff/circle_activate5.png' },
      ]
    );
    this.addGamemode(
      Dodgebot,
      {
        joinPhase: 2,
        backgroundColor: 0x061639,
        moveWhilePhased: true,
        respawn: {
          time: 1,
          phase: 1.5,
        },
        highscore: {
          order: HIGHSCORE_ORDER_DESCENDING,
          scores: {
            Best_Time_Alive: {
              initial: 0,
              primary: true,
              display: HIGHSCORE_DISPLAY_BEST('Time Alive'),
            },
            Time_Alive: {
              initial: 0,
              display: HIGHSCORE_DISPLAY_TIME,
              events: [{ trigger: EVENT_TRIGGER_DEATH, action: EVENT_ACTION_RESET }],
            },
            Deaths: {
              initial: 0,
              events: [{ trigger: EVENT_TRIGGER_DEATH, action: EVENT_ACTION_INCREMENT }],
            },
          },
        },
      },
      [{ name: 'dangerbot', path: 'dangerbot/dangerbot2.png' }]
    );
    this.addGamemode(KnockOffRandom, {}, [], KnockOff);
    this.addGamemode(KnockOffDynamic, {}, [], KnockOff);
    this.addGamemode(KnockOffWander, {}, [], KnockOff);
    this.addGamemode(TestGamemode);
  }

  addGamemode(Gamemode, options = {}, resources = [], extending = []) {
    let extendingArray = extending;
    if (extending.constructor !== Array) {
      extendingArray = [extending];
    }
    const { name } = Gamemode;
    this.gamemodes[name] = Gamemode;
    this.configs[name] = new GamemodeConfig(this, name, resources, options, extendingArray);
  }
}

class GamemodeConfigHandler {
  constructor(game, gamemode, options) {
    this.game = game;
    this.binds = {};
    this.gamemode = gamemode;
    this.options = options;

    this.onDeath = this.onDeath.bind(this);

    this.playerRadius = 32;
    this.joinPhase = 0;

    this.moveWhilePhased = true;

    this.tagging = false;
    this.tagTime = 0;
    this.tags = {};

    this.abilities = {};

    this.onDeathEvents = [];
    this.onKillEvents = [];

    this.advancedDisplays = [];
    this.timeDisplays = [];

    this.injectBinds();
    this.setUpOptions();
  }

  static getGamemodes() {
    return new GamemodeConfigList();
  }

  setUpOptions() {
    this.setUpAbilities();
    this.setUpKillSystem();
    this.setUpHighscores();
    this.setUpMisc();
    this.setUpRespawn();
  }

  setUpAbilities() {
    if (this.options.abilities) {
      this.options.abilities.forEach(ability => {
        ability.timers = {};
      });
      this.abilities = this.options.abilities;
      this.game.setUpGameButtons(this.options.abilities);
    }
  }

  setUpKillSystem() {
    if (this.options.kill) {
      const { tag } = this.options.kill;
      if (tag) {
        this.tagTime = tag.tagTime;
        this.tagging = true;
      }
    }
  }

  setUpMisc() {
    if (this.options.backgroundColor !== undefined) {
      this.game.app.renderer.backgroundColor = this.options.backgroundColor;
    }
    if (this.options.moveWhilePhased !== undefined) {
      this.moveWhilePhased = this.options.moveWhilePhased;
    }
    if (this.options.playerRadius !== undefined) {
      this.playerRadius = this.options.playerRadius;
    }
    if (this.options.joinPhase !== undefined) {
      this.joinPhase = this.options.joinPhase;
    }
  }

  setUpRespawn() {
    if (this.options.respawn) {
      let { time, phase } = this.options.respawn;
      if (time === undefined) {
        time = 0;
      }
      if (phase === undefined) {
        phase = 0;
      }
      this.respawnTime = time;
      this.respawnPhaseTime = phase;
      this.respawn = true;
      this.game.respawnHandler.registerRespawnListener(this.gamemode);
      this.injectBind('onRespawn');
    }
  }

  setUpHighscores() {
    if (this.options.highscore) {
      if (this.options.highscore.order) {
        this.game.scoreManager.setAscOrder(this.options.highscore.order);
      }
      Object.keys(this.options.highscore.scores).forEach(title => {
        const score = this.options.highscore.scores[title];
        const name = title.replace(/_/g, ' ');
        const { initial, primary } = score;
        this.game.scoreManager.addScoreType(name, initial, primary);
      });
      this.gamemode.hs_list = new HighscoreList(this.game.scoreManager, this.game);

      this.setUpHighscoreEvents();
    }
  }

  setUpHighscoreEvents() {
    Object.keys(this.options.highscore.scores).forEach(title => {
      const highscore = this.options.highscore.scores[title];
      const name = title.replace(/_/g, ' ');
      const { initial, display, events } = highscore;
      if (display !== undefined) {
        switch (display) {
          case HIGHSCORE_DISPLAY_TIME:
            this.timeDisplays.push({ name });
            break;
          case HIGHSCORE_DISPLAY_LATENCY:
            // Displayed through event from instance by game core.
            break;
          default:
            if (display.type) {
              const { type, target } = display;
              let cond;
              let update;
              switch (type) {
                case 'best':
                  cond = (stored, comp) => comp > stored;
                  update = (stored, comp) => comp;
                  break;
                default:
                  throw new Error(`Invalid advanced display type '${type}'.`);
              }
              // Prettier wants this line on 1 row but eslint wants it spread out...
              // eslint-disable-next-line
              this.advancedDisplays.push({ name, target, cond, update });
            } else {
              throw new Error(`Invalid display type '${display}'.`);
            }
        }
      }
      if (events !== undefined) {
        events.forEach(event => {
          const { trigger, action } = event;
          let actionFunc;
          switch (action) {
            case EVENT_ACTION_RESET:
              actionFunc = () => initial;
              break;
            case EVENT_ACTION_INCREMENT:
              actionFunc = n => n + 1;
              break;
            case EVENT_ACTION_DECREMENT:
              actionFunc = n => n - 1;
              break;
            default:
              throw new Error(`Invalid event action '${action}'.`);
          }
          switch (trigger) {
            case EVENT_TRIGGER_DEATH:
              this.onDeathEvents.push({ name, action: actionFunc });
              break;
            case EVENT_TRIGGER_KILL:
              this.onKillEvents.push({ name, action: actionFunc });
              break;
            default:
              throw new Error(`Invalid event trigger '${trigger}'.`);
          }
        });
      }
    });
  }

  injectBinds() {
    this.injectBind('preUpdate');
    this.injectBind('postUpdate');
    this.injectBind('onPlayerJoin');
    this.injectBind('onPlayerCreated');
    this.injectBind('onPlayerLeave');
    this.injectBind('onButtonPressed');
  }

  injectBind(func) {
    const temp = this.gamemode[func];

    this.gamemode[func] = this[func].bind(this);
    if (temp === undefined) {
      this.binds[func] = () => {};
    } else {
      this.binds[func] = temp.bind(this.gamemode);
    }
  }

  preUpdate(dt) {
    Object.keys(this.abilities).forEach(button => {
      const { cooldown, duration, deactivateFunc } = this.abilities[button];
      Object.keys(this.abilities[button].timers).forEach(id => {
        const timer = this.abilities[button].timers[id];
        timer.time -= dt;
        if (timer.active && timer.time <= cooldown - duration) {
          deactivateFunc(this.gamemode.players[id], this.gamemode.resources, this.game);
          timer.active = false;
        }
      });
    });
    if (this.tagging) {
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
    }
    this.timeDisplays.forEach(display => {
      const { name } = display;
      this.game.entityHandler.getPlayers().forEach(entity => {
        if (!entity.isDead) {
          const { id } = entity.controller;
          this.game.scoreManager.addScore(name, id, dt);
        }
      });
    });
    this.binds.preUpdate(dt);
  }

  onDeath(entity) {
    if (entity.isPlayer() && !entity.playerLeft) {
      const { id } = entity.controller;
      this.onDeathEvents.forEach(event => {
        const { name, action } = event;
        this.game.scoreManager.mutateScore(name, id, action);
      });
      if (this.tagging) {
        this.tags[id].forEach(item => {
          // console.log('%s killed %s', item.id, id);
          this.onKillEvents.forEach(event => {
            const { name, action } = event;
            this.game.scoreManager.mutateScore(name, item.id, action);
          });
        });
        this.tags[id] = [];
      }
    }
    if (this.respawn) {
      if (entity.isPlayer() && entity.playerLeft) {
        this.game.entityHandler.unregisterFully(entity);
      } else if (entity.respawnable) {
        this.game.respawnHandler.addRespawn(entity, this.respawnTime);
      }
    }
  }

  postUpdate(dt) {
    const players = Object.keys(this.gamemode.players);
    this.advancedDisplays.forEach(display => {
      // Prettier wants this line on 1 row but eslint wants it spread out...
      // eslint-disable-next-line
      const { name, target, cond, update } = display;
      players.forEach(id => {
        const current = this.game.scoreManager.getScore(name, id);
        const score = this.game.scoreManager.getScore(target, id);
        if (cond(current, score)) {
          this.game.scoreManager.setScore(name, id, update(current, score));
        }
      });
    });
    this.binds.postUpdate(dt);
  }

  onPlayerJoin(playerObject) {
    const { iconID, id } = playerObject;

    return new Promise(resolve => {
      this.game.resourceServer
        .requestResources([{ name: iconData[iconID].name, path: iconData[iconID].img }])
        .then(resources => {
          const circle = new PlayerCircle(
            this.game,
            resources[iconData[iconID].name],
            this.playerRadius
          );
          const controller = new PlayerController(this.game, id);
          circle.setController(controller);
          const backgroundCol = Number.parseInt(playerObject.backgroundColor.substr(1), 16);
          const iconCol = Number.parseInt(playerObject.iconColor.substr(1), 16);

          circle.setColor(backgroundCol, iconCol);

          this.gamemode.players[id] = circle;
          this.game.register(circle);

          this.gamemode.onPlayerCreated(playerObject, circle);

          resolve(circle);
        });
    });
  }

  onPlayerCreated(playerObject, circle) {
    const { id } = playerObject;
    Object.keys(this.abilities).forEach(button => {
      this.abilities[button].timers[id] = { active: false, time: 0 };
    });
    if (this.tagging) {
      this.tags[id] = [];
      circle.collision.addListener((player, victim) => {
        if (victim.isPlayer()) {
          const vid = victim.controller.id;
          const pid = player.controller.id;
          this.tags[vid] = this.tags[vid].filter(e => e.id !== pid);
          this.tags[vid].push({ id: pid, timer: this.tagTime });
        }
      });
    }
    if (this.respawn) {
      circle.addDeathListener(this.onDeath);
    }
    circle.phase(this.joinPhase);
    circle.moveWhilePhased = this.moveWhilePhased;
    this.binds.onPlayerCreated(playerObject, circle);
  }

  onPlayerLeave(idTag) {
    if (this.tagging) {
      this.tags[idTag] = [];
    }
    // Turn the players entity into a dummy, leaving it in the game until it dies
    this.gamemode.players[idTag].ownerLeft();

    this.binds.onPlayerLeave(idTag);
  }

  onRespawn(entity) {
    if (this.respawnPhaseTime > 0) {
      entity.phase(this.respawnPhaseTime);
    }
    this.binds.onRespawn(entity);
  }

  onButtonPressed(id, button) {
    if (this.abilities[button]) {
      const ability = this.abilities[button];
      const playerEntity = this.gamemode.players[id];
      if (ability.timers[id].time <= 0) {
        ability.activateFunc(playerEntity, this.gamemode.resources, this.game);
        ability.timers[id].time = ability.cooldown;
        ability.timers[id].active = true;
      }
    }
    this.binds.onButtonPressed(id, button);
  }
}

export default GamemodeConfigHandler;

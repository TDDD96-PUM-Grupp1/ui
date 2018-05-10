import GamemodeConfig from './GamemodeConfig';
import TestGamemode from './gamemodes/TestGamemode';
import KnockOff from './gamemodes/KnockOff';
import KnockOffRandom from './gamemodes/KnockOffRandom';
import KnockOffDynamic from './gamemodes/KnockOffDynamic';
import KnockOffWander from './gamemodes/KnockOffWander';
import Dodgebot from './gamemodes/Dodgebot';
import Passthebomb from './gamemodes/Passthebomb';
import Passthebombv2 from './gamemodes/Passthebombv2';

import HighscoreList from './HighscoreList';

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
        backgroundColor: 0x061639,
        abilities: [
          {
            name: 'Super Heavy',
            cooldown: 10,
            duration: 3,
            activateFunc: entity => {
              entity.mass *= 50;
              entity.graphic.tint ^= 0xffffff;
            },
            deactivateFunc: entity => {
              entity.mass /= 50;
              entity.graphic.tint ^= 0xffffff;
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
      [{ name: 'arena', path: 'knockoff/arena.png' }]
    );
    this.addGamemode(
      Dodgebot,
      {
        backgroundColor: 0x061639,
        moveWhilePhased: false,
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
    this.addGamemode(
      Passthebomb,
      {
        backgroundColor: 0x061639,
        moveWhilePhased: true,
        respawn: {
          time: 1,
          phase: 1.5,
        },
        highscore: {
          order: HIGHSCORE_ORDER_DESCENDING,
          scores: {
            Times_Avoided_Death: {
              initial: 0,
              primary: true,
            },
            Bomb_Passes: {
              initial: 0,
            },
            Deaths: {
              initial: 0,
              events: [{ trigger: EVENT_TRIGGER_DEATH, action: EVENT_ACTION_INCREMENT }],
            },
          },
        },
      },
      []
    );
    this.addGamemode(
          Passthebombv2,
          {
            backgroundColor: 0x061639,
            moveWhilePhased: true,
            respawn: {
              time: 1,
              phase: 1.5,
            },
            highscore: {
              order: HIGHSCORE_ORDER_DESCENDING,
              scores: {
                Times_Avoided_Death: {
                  initial: 0,
                  primary: true,
                },
                Bomb_Passes: {
                  initial: 0,
                },
                Deaths: {
                  initial: 0,
                  events: [{ trigger: EVENT_TRIGGER_DEATH, action: EVENT_ACTION_INCREMENT }],
                },
              },
            },
          },
          []
        );
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

    this.moveWhilePhased = true;

    this.tagging = false;
    this.tagTime = 0;
    this.tags = {};

    this.abilities = {};

    this.onDeathEvents = [];
    this.onKillEvents = [];

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
      const score = this.options.highscore.scores[title];
      const name = title.replace(/_/g, ' ');
      const { initial, display, events } = score;
      if (display !== undefined) {
        switch (display) {
          case HIGHSCORE_DISPLAY_TIME:
            this.timeDisplays.push({ name });
            break;
          case HIGHSCORE_DISPLAY_LATENCY:
            break;
          default:
            throw new Error(`Invalid display type '${display}'.`);
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
    this.injectBind('onDeath');
    this.injectBind('preUpdate');
    this.injectBind('postUpdate');
    this.injectBind('onPlayerCreated');
    this.injectBind('onPlayerLeave');
    this.injectBind('onRespawn');
    this.injectBind('onButtonPressed');
  }

  injectBind(func) {
    const temp = this.gamemode[func];
    this.gamemode[func] = this[func].bind(this);
    this.binds[func] = temp.bind(this.gamemode);
  }

  preUpdate(dt) {
    Object.keys(this.abilities).forEach(button => {
      const { cooldown, duration, deactivateFunc } = this.abilities[button];
      Object.keys(this.abilities[button].timers).forEach(id => {
        const timer = this.abilities[button].timers[id];
        timer.time -= dt;
        if (timer.active && timer.time <= cooldown - duration) {
          deactivateFunc(this.gamemode.players[id]);
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
    if (entity.isPlayer()) {
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
    this.binds.onDeath(entity);
  }

  postUpdate(dt) {
    this.binds.postUpdate(dt);
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
      circle.addEntityListener(this.gamemode);
    }
    circle.moveWhilePhased = this.moveWhilePhased;
    this.binds.onPlayerCreated(playerObject, circle);
  }

  onPlayerLeave(idTag) {
    if (this.tagging) {
      delete this.tags[idTag];
    }
    this.binds.onPlayerLeave(idTag);
  }

  onRespawn(entity) {
    if (this.respawn) {
      if (this.respawnPhaseTime > 0) {
        entity.phase(this.respawnPhaseTime);
      }
    }
    this.binds.onRespawn(entity);
  }

  onButtonPressed(id, button) {
    if (this.abilities[button]) {
      const ability = this.abilities[button];
      const playerEntity = this.gamemode.players[id];
      if (ability.timers[id].time <= 0) {
        ability.activateFunc(playerEntity);
        ability.timers[id].time = ability.cooldown;
        ability.timers[id].active = true;
      }
    }
    this.binds.onButtonPressed(id, button);
  }
}

export default GamemodeConfigHandler;

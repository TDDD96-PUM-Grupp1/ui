import GamemodeConfig from './GamemodeConfig';

import TestGamemode from './gamemodes/TestGamemode';
import KnockOff from './gamemodes/KnockOff';
import KnockOffRandom from './gamemodes/KnockOffRandom';
import KnockOffDynamic from './gamemodes/KnockOffDynamic';
import KnockOffWander from './gamemodes/KnockOffWander';
import Dodgebot from './gamemodes/Dodgebot';

import AbilitySystem from './configsystems/AbilitySystem';
import RespawnSystem from './configsystems/RespawnSystem';
import KillSystem from './configsystems/KillSystem';
import HighscoreSystem from './configsystems/HighscoreSystem';
import SpawnSystem from './configsystems/SpawnSystem';

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

class GamemodeConfigList {
  constructor() {
    this.gamemodes = {};
    this.configs = {};
    this.loadConfig();
  }

  getConfig(Gamemode) {
    return this.configs[Gamemode];
  }

  loadConfig() {
    this.addGamemode(
      'KnockOff',
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
      'Dodgebot',
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
    this.addGamemode('KORandom', KnockOffRandom, {}, [], KnockOff);
    this.addGamemode('KODynamic', KnockOffDynamic, {}, [], KnockOff);
    this.addGamemode('KOWander', KnockOffWander, {}, [], KnockOff);
    this.addGamemode('TestGamemode', TestGamemode);
  }

  addGamemode(name, Gamemode, options = {}, resources = [], extending = []) {
    let extendingArray = extending;
    if (extending.constructor !== Array) {
      extendingArray = [extending];
    }
    this.gamemodes[name] = Gamemode;
    this.configs[Gamemode] = new GamemodeConfig(this, name, resources, options, extendingArray);
  }
}

class GamemodeConfigHandler {
  constructor(game, gamemode, options) {
    this.game = game;
    this.binds = {};
    this.gamemode = gamemode;
    this.options = options;

    this.hooks = {};

    this.systems = [];
    this.preUpdateSystems = [];
    this.postUpdateSystems = [];
    this.onPlayerJoinSystem = null;
    this.onPlayerCreatedSystems = [];
    this.onPlayerLeaveSystems = [];
    this.onButtonPressedSystems = [];

    this.injectBinds();
    this.setUpOptions();
  }

  getPlayerEntity(id) {
    return this.gamemode.players[id];
  }

  addHook(hook) {
    if (this.hooks[hook]) {
      throw new Error(`Hook '${hook}' is already defined.`);
    }
    this.hooks[hook] = [];
  }

  triggerHook(hook, params) {
    if (this.hooks[hook] === undefined) {
      throw new Error(`Hook '${hook}' is not defined.`);
    }
    this.hooks[hook].forEach(func => func(params));
  }

  hookUp(hook, func) {
    if (this.hooks[hook] === undefined) {
      throw new Error(`Hook '${hook}' is not defined.`);
    }
    this.hooks[hook].push(func);
  }

  addSystem(System) {
    const system = new System(this, this.options);
    this.systems.push(system);
    const binds = system.setup(this);
    if (binds === undefined) {
      throw new Error(`${System.name}'s setup method did not return an object.`);
    }
    if (binds.preUpdate) {
      this.preUpdateSystems.push(system);
    }
    if (binds.postUpdate) {
      this.postUpdateSystems.push(system);
    }
    if (binds.onPlayerJoin) {
      if (this.onPlayerJoinSystem !== null) {
        throw new Error('GamemodeConfigHandler loaded two spawn systems.');
      }
      this.onPlayerJoinSystem = system;
    }
    if (binds.onPlayerCreated) {
      this.onPlayerCreatedSystems.push(system);
    }
    if (binds.onPlayerLeave) {
      this.onPlayerLeaveSystems.push(system);
    }
    if (binds.onButtonPressed) {
      this.onButtonPressedSystems.push(system);
    }
  }

  static getGamemodes() {
    return new GamemodeConfigList();
  }

  setUpOptions() {
    if (this.options.abilities) {
      this.addSystem(AbilitySystem);
    }
    if (this.options.kill) {
      this.addSystem(KillSystem);
    }
    if (this.options.highscore) {
      this.addSystem(HighscoreSystem);
    }
    if (this.options.respawn) {
      this.addSystem(RespawnSystem);
    }
    if (this.options.backgroundColor !== undefined) {
      this.game.app.renderer.backgroundColor = this.options.backgroundColor;
    }

    this.addSystem(SpawnSystem);

    this.systems.forEach(system => system.attachHooks());
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
    this.preUpdateSystems.forEach(system => system.preUpdate(dt));
    this.binds.preUpdate(dt);
  }

  postUpdate(dt) {
    this.postUpdateSystems.forEach(system => system.postUpdate(dt));
    this.binds.postUpdate(dt);
  }

  onPlayerJoin(playerObject) {
    return this.onPlayerJoinSystem.onPlayerJoin(playerObject);
  }

  onPlayerCreated(playerObject, circle) {
    this.onPlayerCreatedSystems.forEach(system => system.onPlayerCreated(playerObject, circle));
    this.binds.onPlayerCreated(playerObject, circle);
  }

  onPlayerLeave(id) {
    this.onPlayerLeave.forEach(system => system.onPlayerLeave(id));

    // Turn the players entity into a dummy, leaving it in the game until it dies
    this.gamemode.players[id].ownerLeft();

    this.binds.onPlayerLeave(id);
  }

  onButtonPressed(id, button) {
    this.onButtonPressedSystems.forEach(system => system.onButtonPressed(id, button));
    this.binds.onButtonPressed(id, button);
  }
}

export default GamemodeConfigHandler;

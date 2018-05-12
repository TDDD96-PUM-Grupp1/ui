import GamemodeConfig from './GamemodeConfig';
import TestGamemode from './gamemodes/TestGamemode';
import KnockOff from './gamemodes/KnockOff';
import KnockOffRandom from './gamemodes/KnockOffRandom';
import KnockOffDynamic from './gamemodes/KnockOffDynamic';
import KnockOffWander from './gamemodes/KnockOffWander';
import Dodgebot from './gamemodes/Dodgebot';

import PlayerCircle from './entities/PlayerCircle';
import PlayerController from './entities/controllers/PlayerController';
import iconData from './iconData';
import AbilitySystem from './ConfigSystems.js/AbilitySystem';
import RespawnSystem from './ConfigSystems.js/RespawnSystem';
import KillSystem from './ConfigSystems.js/KillSystem';
import HighscoreSystem from './ConfigSystems.js/HighscoreSystem';

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

    this.playerRadius = 32;
    this.joinPhase = 0;

    this.moveWhilePhased = true;

    this.preUpdateSystems = [];
    this.postUpdateSystems = [];
    this.onPlayerJoinSystems = [];
    this.onPlayerCreatedSystems = [];
    this.onPlayerLeaveSystems = [];
    this.onButtonPressedSystems = [];

    this.injectBinds();
    this.setUpOptions();
  }

  getPlayerEntity(id) {
    // TODO: Move player entity list location out of gamemode.
    return this.gamemode.players[id];
  }

  addSystem(System) {
    const system = new System(this, this.options);
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
      this.onPlayerJoinSystems.push(system);
    }
    if (binds.onPlayerCreated) {
      this.onPlayerCreatedSystems.push(system);
    }
    if (binds.onPlayerJoinSystems) {
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
    this.setUpAbilities();
    this.setUpKillSystem();
    this.setUpHighscores();
    this.setUpMisc();
    this.setUpRespawn();
  }

  setUpAbilities() {
    if (this.options.abilities) {
      this.addSystem(AbilitySystem);
    }
  }

  setUpKillSystem() {
    if (this.options.kill) {
      this.addSystem(KillSystem);
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
      this.addSystem(RespawnSystem);
    }
  }

  setUpHighscores() {
    if (this.options.highscore) {
      this.addSystem(HighscoreSystem);
    }
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
    this.onPlayerJoinSystems.forEach(system => system.onPlayerJoin(playerObject));
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
    this.onPlayerCreatedSystems.forEach(system => system.onPlayerCreated(playerObject, circle));

    circle.phase(this.joinPhase);
    circle.moveWhilePhased = this.moveWhilePhased;

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

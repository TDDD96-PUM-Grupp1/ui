import settings from '../config';
import GamemodeConfig from './GamemodeConfig';
import TestGamemode from './gamemodes/TestGamemode';
import KnockOff from './gamemodes/KnockOff';
import KnockOffRandom from './gamemodes/KnockOffRandom';
import KnockOffDynamic from './gamemodes/KnockOffDynamic';
import KnockOffWander from './gamemodes/KnockOffWander';
import Dodgebot from './gamemodes/Dodgebot';

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

/*
Singleton class for handling gamemode storage and selection
*/
class GMHandlerClass {
  constructor() {
    // Map of all available gamemodes
    this.gamemodes = {};
    // Map of the gamemodes configs
    this.configs = {};

    if (settings.skipmenu) {
      this.selected = settings.defaultGamemode;
    } else {
      this.selected = '';
    }
  }

  loadConfig() {
    this.addGamemode(
      KnockOff,
      {
        backgroundColor: 0x061639,
        abilities: [
          {
            button: 0,
            cooldown: 10,
            active: 3,
            func: entity => {
              entity.mass *= 50;
            },
          },
        ],
        kill: {
          tag: {
            tagTime: 4,
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
        respawn: {
          time: 1,
          phase: 1.5,
          moveWhilePhased: false,
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
    this.addGamemode(TestGamemode);
  }

  addGamemode(Gamemode, options = {}, resources = [], extending = []) {
    let extendingArray = extending;
    if (extending.constructor !== Array) {
      extendingArray = [extending];
    }
    const { name } = Gamemode;
    this.gamemodes[name] = Gamemode;
    this.configs[name] = new GamemodeConfig(name, resources, options, extendingArray);
  }

  getConfig(Gamemode) {
    return this.configs[Gamemode.name];
  }

  /*
    Get list of all names of available gamemodes
  */
  getGamemodes() {
    return Object.keys(this.gamemodes);
  }

  /*
  Set the selected gamemode
  */
  selectGameMode(name) {
    if (name in this.gamemodes) {
      this.selected = name;
    } else {
      throw new Error(`Gamemode ${name} does not exist`);
    }
  }

  /*
  Get which gamemode has been selected
  */
  getSelected() {
    if (!this.selected) {
      throw new Error('Gamemode has not been selected');
    }

    return {
      SelectedMode: this.gamemodes[this.selected],
      requestedResources: this.configs[this.selected].resources,
      options: this.configs[this.selected].options,
    };
  }

  /*
   * Get the selected mode identifier, this will return the name
   * of the current gamemode.
   */
  getSelectedId() {
    return this.selected;
  }
}

/*
Singleton Pattern from http://www.dofactory.com/javascript/singleton-design-pattern
*/
const GamemodeHandler = (() => {
  let instance;

  const createInstance = () => new GMHandlerClass();

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
        instance.loadConfig();
      }

      return instance;
    },
  };
})();

export default GamemodeHandler;

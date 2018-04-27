import settings from '../config';
import GamemodeConfig from './GamemodeConfig';
import TestGamemode from './gamemodes/TestGamemode';
import KnockOff from './gamemodes/KnockOff';
import KnockOffRandom from './gamemodes/KnockOffRandom';
import KnockOffDynamic from './gamemodes/KnockOffDynamic';
import KnockOffWander from './gamemodes/KnockOffWander';
import Dodgebot from './gamemodes/Dodgebot';

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
          Kills: { default: 0, primary: true, events: [{ trigger: 'kill', action: 'increment' }] },
          Deaths: { default: 0, events: [{ trigger: 'death', action: 'increment' }] },
          Latency: { default: '- ms', display: 'latency' },
        },
      },
      [{ name: 'arena', path: 'knockoff/arena.png' }]
    );
    this.addGamemode(
      Dodgebot,
      {
        respawn: {
          time: 1,
          phase: 1.5,
          moveWhilePhased: false,
        },
        highscore: {
          Best_Time_Alive: {
            default: 0,
            primary: true,
          },
          Time_Alive: {
            default: 0,
            display: 'time',
            events: [{ trigger: 'kill', action: 'reset' }],
          },
          Deaths: { default: 0, events: [{ trigger: 'death', action: 'increment' }] },
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

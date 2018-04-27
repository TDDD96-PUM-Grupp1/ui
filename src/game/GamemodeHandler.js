import TestGamemode from './gamemodes/TestGamemode';
import KnockOff from './gamemodes/KnockOff';
import settings from '../config';
import KORandom from './gamemodes/KORandom';
import KODynamic from './gamemodes/KODynamic';
import KOWander from './gamemodes/KOWander';
import Dodgebot from './gamemodes/Dodgebot';

/*
Singleton class for handling gamemode storage and selection
*/
class GMHandlerClass {
  constructor() {
    // List of all available gamemodes
    this.gamemodes = {
      knockOff: KnockOff,
      KORandom: KORandom,
      KODynamic: KODynamic,
      KOWander: KOWander,
      dodgebot: Dodgebot,
      testGamemode: TestGamemode,
    };

    this.gamemodeResources = {
      knockOff: [{ name: 'arena', path: 'knockoff/arena.png' }],
      KORandom: [{ name: 'arena', path: 'knockoff/arena.png' }],
      KODynamic: [{ name: 'arena', path: 'knockoff/arena.png' }],
      KOWander: [{ name: 'arena', path: 'knockoff/arena.png' }],
      dodgebot: [{ name: 'dangerbot', path: 'dangerbot/dangerbot2.png' }],
      testGamemode: [],
    };

    if (settings.skipmenu) {
      this.selected = settings.defaultGamemode;
    } else {
      this.selected = '';
    }
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
      requestedResources: this.gamemodeResources[this.selected],
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
      }

      return instance;
    },
  };
})();

export default GamemodeHandler;

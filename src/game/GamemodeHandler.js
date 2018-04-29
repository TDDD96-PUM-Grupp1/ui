import TestGamemode from './gamemodes/TestGamemode';
import KnockOff from './gamemodes/KnockOff';
import settings from '../config';
import KnockOffRandom from './gamemodes/KnockOffRandom';
import KnockOffDynamic from './gamemodes/KnockOffDynamic';
import KnockOffWander from './gamemodes/KnockOffWander';

/**
 * Singleton class for handling gamemode storage and selection
 */
class GMHandlerClass {
  constructor() {
    // List of all available gamemodes
    this.gamemodes = {
      knockOff: KnockOff,
      knockOffRandom: KnockOffRandom,
      knockOffDynamic: KnockOffDynamic,
      knockOffWander: KnockOffWander,
      testGamemode: TestGamemode,
    };

    this.gamemodeResources = {
      knockOff: [{ name: 'arena', path: 'knockoff/arena.png' }],
      knockOffRandom: [{ name: 'arena', path: 'knockoff/arena.png' }],
      knockOffDynamic: [{ name: 'arena', path: 'knockoff/arena.png' }],
      knockOffWander: [{ name: 'arena', path: 'knockoff/arena.png' }],
      testGamemode: [],
    };

    /**
       The name, amount and order of the buttons used by a gamemode
     */
    this.buttonsUsed = {
      knockOff: ['Super Heavy'],
      knockOffDynamic: ['Super Heavy'],
      knockOffRandom: ['Super Heavy'],
      knockOffWander: ['Super Heavy'],
      testGamemode: ['Test Ability 1', 'Test Ability 2'],
    };

    if (settings.skipmenu) {
      this.selected = settings.defaultGamemode;
    } else {
      this.selected = '';
    }
  }

  /**
   Get list of all names of available gamemodes
   */
  getGamemodes() {
    return Object.keys(this.gamemodes);
  }

  /**
   Set the selected gamemode
   */
  selectGameMode(name) {
    if (name in this.gamemodes) {
      this.selected = name;
    } else {
      throw new Error(`Gamemode ${name} does not exist`);
    }
  }

  /**
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

  /**
   * Get the selected mode identifier, this will return the name
   * of the current gamemode.
   */
  getSelectedId() {
    return this.selected;
  }

  /**
   * Returns an array containing each buttons name for the selected game-mode
   */
  getButtons() {
    return this.buttonsUsed[this.selected];
  }
}
/**
 * Singleton Pattern from http://www.dofactory.com/javascript/singleton-design-pattern
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

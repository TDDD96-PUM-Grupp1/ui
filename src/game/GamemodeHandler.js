import TestGamemode from './gamemodes/TestGamemode';
import KnockOff from './gamemodes/KnockOff';

/*
Singleton class for handling gamemode storage and selection
*/
class GMHandlerClass {
  constructor() {
    // List of all available gamemodes
    this.gamemodes = {
      knockOff: KnockOff,
      test: TestGamemode,
    };

    this.selected = '';
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

    return this.gamemodes[this.selected];
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

import TestGamemode from './gamemodes/TestGamemode';

const GAMEMODES = {
  mode1: TestGamemode,

};

class GamemodeHandler {
  /*
    Get list of all names of available gamemodes
  */
  getGamemodes() {
    return GAMEMODES.keys();
  }

  /*
  */
  getGamemodeFromName(name) {
    return mode1[name];
  }
}

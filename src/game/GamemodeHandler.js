import settings from '../config';
import GamemodeConfigHandler from './GamemodeConfigHandler';

/**
 * Singleton class for handling gamemode storage and selection
 */
class GMHandlerClass {
  constructor() {
    const { gamemodes, configs } = GamemodeConfigHandler.getGamemodes();
    // Map of all available gamemodes
    this.gamemodes = gamemodes;
    // Map of the gamemodes configs
    this.configs = configs;

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
      requestedResources: this.configs[this.selected].resources,
      options: this.configs[this.selected].options,
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
    const buttons = [];
    if (this.configs[this.selected].options.abilities) {
      this.configs[this.selected].options.abilities.forEach(ability => {
        buttons.push({
          name: ability.name,
          cooldown: ability.cooldown,
          duration: ability.duration,
        });
      });
    }
    return buttons;
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

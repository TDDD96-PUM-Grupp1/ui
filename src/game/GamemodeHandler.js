import settings from '../config';
import GamemodeConfig from './GamemodeConfig';

import TestGamemode from './gamemodes/TestGamemode';
import KnockOff from './gamemodes/KnockOff';
import KnockOffRandom from './gamemodes/KnockOffRandom';
import KnockOffDynamic from './gamemodes/KnockOffDynamic';
import KnockOffWander from './gamemodes/KnockOffWander';
import KnockOffSpinner from './gamemodes/KnockOffSpinner';
import DodgebotBumper from './gamemodes/DodgebotBumper';
import Dodgebot from './gamemodes/Dodgebot';
import Hockey from './gamemodes/Hockey';
import PassTheBomb from './gamemodes/PassTheBomb';

/**
 * Singleton class for handling gamemode storage and selection
 */
class GMHandlerClass {
  constructor() {
    // Map of all available gamemodes
    this.gamemodes = {};
    // Map of the gamemodes configs
    this.configs = {};
    // Map of gamemode rules
    this.rules = {};

    this.addGamemodes();

    this.selected = '';
    if (settings.skipmenu) {
      this.selectGameMode(settings.defaultGamemode);
    }
  }

  addGamemodes() {
    this.addGamemode('Knock Off', KnockOff);
    this.addGamemode('Dodgebot', Dodgebot);
    this.addGamemode('Knock Off Random', KnockOffRandom, false);
    this.addGamemode('Knock Off Dynamic', KnockOffDynamic, false);
    this.addGamemode('Knock Off Wander', KnockOffWander);
    this.addGamemode('Test Gamemode', TestGamemode, false);
    this.addGamemode('Knock Off Spinner', KnockOffSpinner);
    this.addGamemode('Dodgebot Bumpers', DodgebotBumper);
    this.addGamemode('Hockey', Hockey);
    this.addGamemode('Pass The Bomb', PassTheBomb);
  }

  addGamemode(name, Gamemode, visible = true) {
    const options = Gamemode.getConfig();
    const resources = Gamemode.getResources();

    this.rules[name] = options.rules;
    this.gamemodes[name] = { Gamemode, visible };
    this.configs[name] = new GamemodeConfig(name, resources, options);
  }

  /**
   Get list of all names of available gamemodes
   */
  getGamemodes() {
    const list = [];
    // Only add visible gamemodes to the list
    Object.keys(this.gamemodes).forEach(name => {
      const { visible } = this.gamemodes[name];
      if (visible) {
        list.push(name);
      }
    });
    return list;
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

    const { Gamemode } = this.gamemodes[this.selected];
    const { resources, options } = this.configs[this.selected];

    return {
      SelectedMode: Gamemode,
      requestedResources: resources,
      options,
    };
  }

  /**
   Get description of gamemode rules.
   */
  getRules(gamemode) {
    return this.rules[gamemode];
  }

  /**
   * Get the selected mode identifier, this will return the name
   * of the current gamemode.
   */
  getSelectedId() {
    return this.selected;
  }

  /**
   * Returns an array containing button information for the selected game-mode
   */
  getButtons() {
    const { options } = this.configs[this.selected];

    const buttons = [];
    if (options.abilities) {
      options.abilities.forEach(ability => {
        buttons.push({
          name: ability.name,
          cooldown: ability.cooldown,
          duration: ability.duration,
          color: ability.color,
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

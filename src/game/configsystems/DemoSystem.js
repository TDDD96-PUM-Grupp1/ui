import ConfigSystem from './ConfigSystem';
import GamemodeHandler from '../GamemodeHandler';

// eslint-disable-next-line
function mod(n, m) {
  return (n % m + m) % m;
}

/*
Demo system, provides functionality for tweaking stuff life.
*/
class DemoSystem extends ConfigSystem {
  constructor(handler, options) {
    super(handler, options);

    const gamemodeHandler = GamemodeHandler.getInstance();
    this.gamemodes = gamemodeHandler.getGamemodes();
    let i = -1;
    this.gamemodes.some(element => {
      i += 1;
      return element === gamemodeHandler.getSelectedId();
    });
    this.currentIndex = i;

    this.handleKeyboardInput = this.handleKeyboardInput.bind(this);
  }

  setup() {
    window.addEventListener('keydown', this.handleKeyboardInput);

    return {};
  }

  handleKeyboardInput(event) {
    const { key } = event;
    if (key === 'p') {
      // Restart current gamemode
      this.game.switchGamemode(this.gamemodes[this.currentIndex]);
    }
    /* TODO:
      Update service and controller when switching to new gamemode.
    if (key === 'i') {
      // Go to previous
      this.game.switchGamemode(this.gamemodes[mod(this.currentIndex - 1, this.gamemodes.length)]);
    } else if (key === 'o') {
      // Go to next
      this.game.switchGamemode(this.gamemodes[mod(this.currentIndex + 1, this.gamemodes.length)]);
    }
    */
  }

  clean() {
    window.removeEventListener('keydown', this.handleKeyboardInput);
  }
}

export default DemoSystem;

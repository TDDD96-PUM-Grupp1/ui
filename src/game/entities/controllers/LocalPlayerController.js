import EntityController from './EntityController';

// Mystery third party code
function keyboard(keyCode) {
  const key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  // The 'downHandler'
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  // The 'upHandler'
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  // Attach event listeners
  window.addEventListener('keydown', key.downHandler.bind(key), false);
  window.addEventListener('keyup', key.upHandler.bind(key), false);
  return key;
}

/*
Local player object controller, takes input from WASD
*/
class LocalPlayerController extends EntityController {
  constructor(id) {
    super();
    this.playerid = id;

    this.time = 0;

    this.accelerationScale = 2000;
  }

  init() {
    this.keyw = keyboard(87);
    this.keya = keyboard(65);
    this.keys = keyboard(83);
    this.keyd = keyboard(68);
  }

  // Update
  update(dt) {
    this.time += dt;

    this.entity.ax = 0;
    this.entity.ay = 0;
    this.entity.vx *= 0.9;
    this.entity.vy *= 0.9;

    if (this.keyw.isDown) {
      this.entity.ay += -1;
    }
    if (this.keya.isDown) {
      this.entity.ax += -1;
    }
    if (this.keys.isDown) {
      this.entity.ay += 1;
    }
    if (this.keyd.isDown) {
      this.entity.ax += 1;
    }
    this.entity.ax *= this.accelerationScale;
    this.entity.ay *= this.accelerationScale;
  }
}

export default LocalPlayerController;

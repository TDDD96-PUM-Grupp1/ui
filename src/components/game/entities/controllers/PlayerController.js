import EntityController from './EntityController';

/*
Player object controller, will handle taking input from player and modifying their objects.
*/
class PlayerController extends EntityController {
  constructor(id) {
    super();
    this.playerid = id;

    this.time = 0;
  }

  init() {
    this.entity.x = 300;
    this.entity.y = 300;
  }

  // Update
  update(dt) {
    this.time += dt;
    this.entity.ax = Math.cos(this.time) * 200;
    this.entity.ay = Math.cos(this.time * 1.2) * 200;
  }
}

export default PlayerController;

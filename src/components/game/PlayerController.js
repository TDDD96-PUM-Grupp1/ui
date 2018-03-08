import EntityController from './EntityController';

/*
Player object controller, will handle taking input from player and modifying their objects.
*/
class PlayerController extends EntityController {
  constructor(id) {
    super();
    this.playerid = id;
  }

  // Update
  update(dt) {
    this.entity.circle.x += 50 * dt;
  }
}

export default PlayerController;

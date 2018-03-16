/*
Game entity base class
*/
class GameEntity {
  /* eslint-disable class-methods-use-this, no-unused-vars, no-useless-constructor,
  no-empty-function */
  constructor(app) {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.mass = 0;
  }
  /* eslint-enable class-methods-use-this, no-unused-vars, no-useless-constructor,
  no-empty-function */

  // Update this entity
  update(dt) {
    if (this.controller != null) {
      this.controller.update(dt);
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  // Update this entity's graphics
  graphicUpdate(dt) {
    this.dt = dt;
    this.graphic.x = this.x;
    this.graphic.y = this.y;
  }

  // Set the controller for this object.
  setController(controller) {
    this.controller = controller;
    controller.register(this);
  }
}

export default GameEntity;

/*
Game entity base class
*/
class GameEntity {
  /* eslint-disable class-methods-use-this, no-unused-vars, no-useless-constructor,
  no-empty-function */
  constructor(app) {}
  /* eslint-enable class-methods-use-this, no-unused-vars, no-useless-constructor,
  no-empty-function */

  // Update this entity
  update(dt) {
    if (this.controller != null) {
      this.controller.update(dt);
    }
  }

  // Set the controller for this object.
  setController(controller) {
    this.controller = controller;
    controller.register(this);
  }
}

export default GameEntity;

/*
Controller base class
*/
class EntityController {
  /* eslint-disable class-methods-use-this, no-unused-vars, no-useless-constructor,
  no-empty-function */
  constructor() {}
  /* eslint-enable class-methods-use-this, no-unused-vars, no-useless-constructor,
  no-empty-function */

  // Register the entity to be controlled by this controller.
  register(entity) {
    this.entity = entity;
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */
  // Update
  update(dt) {
    throw new Error('You must implement the update method of your controller subclass. ');
  }
  /* eslint-enable class-methods-use-this, no-unused-vars */
}

export default EntityController;

/*
Base collision class
*/
class CollisionBase {
  /* eslint-disable class-methods-use-this, no-unused-vars, no-useless-constructor,
  no-empty-function */
  constructor() {}
  /* eslint-enable class-methods-use-this, no-unused-vars, no-useless-constructor,
  no-empty-function */

  // Set the owner of this collision.
  setEntity(entity) {
    this.entity = entity;
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */
  // Check if we are colliding with another entity.
  isColliding(otherEntity, dt) {}

  // Resolve a collision with another entity.
  resolveCollision(otherEntity, dt) {}
  /* eslint-enable class-methods-use-this, no-unused-vars */
}

export default CollisionBase;

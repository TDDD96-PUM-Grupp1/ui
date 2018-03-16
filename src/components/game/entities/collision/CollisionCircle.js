import CollisionBase from './CollisionBase';

/*
Circle collision class
*/
class CollisionCircle extends CollisionBase {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */
  // Check if we are colliding with another entity.
  isColliding(otherEntity, dt) {}

  // Resolve a collision with another entity.
  resolveCollision(otherEntity, dt) {}
  /* eslint-enable class-methods-use-this, no-unused-vars */
}

export default CollisionCircle;

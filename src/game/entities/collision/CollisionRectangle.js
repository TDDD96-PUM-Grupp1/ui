import CollisionBase from './CollisionBase';

/*
Rectangle collision class
*/
class CollisionRectangle extends CollisionBase {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
    this.halfWidth = width / 2;
    this.halfHeight = height / 2;
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */

  /* eslint-enable class-methods-use-this, no-unused-vars */

  getBases() {
    const ex = Math.cos(this.entity.rotation);
    const ey = Math.sin(this.entity.rotation);
    const fx = ey;
    const fy = -ex;
    return [ex, ey, fx, fy];
  }

  // Tell the other collision object to resolve a collision with a rectangle.
  checkCollision(other, dt) {
    other.resolveRectangleCollision(this, dt);
  }

  // Resolve a collision with a circle.
  resolveCircleCollision(circle, dt) {
    // Tell the circle to handle it.
    circle.resolveRectangleCollision(this, dt);
  }

  // Resolve a collision with a rectangle.
  resolveRectangleCollision(rectangle, dt) {
    this.rectangle.crash(dt);
  }
}

export default CollisionRectangle;

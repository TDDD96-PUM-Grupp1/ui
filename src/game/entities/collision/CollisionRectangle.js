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

  /* eslint-disable class-methods-use-this, no-unused-vars */

  // Resolve a collision with a rectangle.
  resolveRectangleCollision(rectangle, dt) {
    // TODO?
  }

  // Resolve a collision with a rectangle.
  resolveLineCollision(rectangle, dt) {
    // TODO?
  }

  /* eslint-enable class-methods-use-this, no-unused-vars */
}

export default CollisionRectangle;

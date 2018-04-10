import CollisionBase from './CollisionBase';

/*
Line collision class
*/
class CollisionLine extends CollisionBase {
  constructor(x2, y2) {
    super();
    // The coordinates of the end point
    this.x2 = x2;
    this.y2 = y2;
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
    other.resolveLineCollision(this, dt);
  }

  // Resolve a collision with a circle.
  resolveCircleCollision(circle, dt) {
    // Tell the circle to handle it.
    circle.resolveLineCollision(this, dt);
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */
  // Resolve a collision with a rectangle.
  resolveRectangleCollision(rectangle, dt) {
    // TODO?
  }

  // Resolve a collision with a line.
  resolveLineCollision(line, dt) {
    // Let's not have any moving lines
  }
  /* eslint-enable class-methods-use-this, no-unused-vars */
}

export default CollisionLine;

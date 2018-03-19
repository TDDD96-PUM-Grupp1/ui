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
  resolveCollision(otherEntity, dt) {
    const [x, y] = this.entity.getNextPosition(dt);
    const [x2, y2] = otherEntity.getNextPosition(dt);
    const xdif = x - x2;
    const ydif = y - y2;
    const sqdist = xdif * xdif + ydif * ydif;
    const rad = this.radius + otherEntity.collision.radius;
    const radsq = rad * rad;
    // compare squared data because sqrt is slow
    if (sqdist <= radsq) {
      this.entity.vx = 0;
      this.entity.vy = 0;
      otherEntity.vx = 0;
      otherEntity.vy = 0;
      // alert("collision");
    }
  }
  /* eslint-enable class-methods-use-this, no-unused-vars */
}

export default CollisionCircle;

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
  // Check if we are colliding with another entity. UNUSED
  isColliding(otherEntity, dt) {}

  /* eslint-enable class-methods-use-this, no-unused-vars */

  // Resolve a collision with another entity.
  resolveCollision(otherEntity, dt) {
    const [x, y] = this.entity.getNextPosition(dt);
    const [x2, y2] = otherEntity.getNextPosition(dt);
    const xdif = x2 - x;
    const ydif = y2 - y;
    const sqdist = xdif * xdif + ydif * ydif;
    const rad = this.radius + otherEntity.collision.radius;
    const radsq = rad * rad;
    // compare squared data because sqrt is slow
    if (sqdist <= radsq) {
      const dvx = this.entity.vx - otherEntity.vx;
      const dvy = this.entity.vy - otherEntity.vy;
      const dcx = xdif * (this.radius / rad);
      const dcy = ydif * (this.radius / rad);
      // parallel proj dv on dc
      const cl = Math.sqrt(dcx * dcx + dcy * dcy);
      const nx = dcx / cl;
      const ny = dcy / cl;
      const scalar = dvx * nx + dvy * ny;
      // Abort if scalar is below 0 (try to figure out why ;) )
      if (scalar > 0) {
        const px = scalar * nx;
        const py = scalar * ny;
        // no mass / restitution involved right now
        this.entity.vx += -px;
        this.entity.vy += -py;
        otherEntity.vx += px;
        otherEntity.vy += py;
      }
    }
  }
}

export default CollisionCircle;

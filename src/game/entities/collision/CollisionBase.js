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

  /*
  Perform a collision between two collision objects.
  p is the collision point
  n is the collision vector (or its normal?)
  */
  collide(other, px, py, cx, cy, dt) {
    const restitution = 0.5; // TODO: calc from objects

    const cl = Math.sqrt(cx * cx + cy * cy);
    const nx = cx / cl;
    const ny = cy / cl;

    const [x1, y1] = this.entity.getNextPosition(dt);
    const [x2, y2] = other.entity.getNextPosition(dt);
    const r1x = px - x1;
    const r1y = py - y1;
    const r2x = px - x2;
    const r2y = py - y2;
    const [r1vx, r1vy] = this.calculatePointVelocity(r1x, r1y);
    const [r2vx, r2vy] = other.calculatePointVelocity(r2x, r2y);
    const vdx = r2vx - r1vx;
    const vdy = r2vy - r2vx;
    const cv = nx * vdx + ny * vdy;
    // if contact velocity is positive, do nothing
    if (cv <= 0) {
      const cn1 = r1x * ny - r1y * nx;
      const cn2 = r2x * ny - r2y * nx;
      const massInverseSum =
        1 / this.entity.mass +
        1 / other.entity.mass +
        cn1 * cn1 / this.entity.I +
        cn2 * cn2 / other.entity.I;
      let impulseSize = -(1 + restitution) * cv;
      impulseSize /= massInverseSum;
      const ix = nx * impulseSize;
      const iy = ny * impulseSize;
      this.applyImpulse(r1x, r1y, -ix, -iy);
      other.applyImpulse(r2x, r2y, ix, iy);

      // TODO: friction
    }
  }

  // Calculate velocity at point
  calculatePointVelocity(px, py) {
    // rotational velocity * point vector rotated 90 degrees clockwise
    return [this.entity.vx + py * this.entity.rv, this.entity.vy + -px * this.entity.rv];
  }

  // Apply an impulse vector at a certain point
  applyImpulse(px, py, ivx, ivy) {
    // Modify velocity
    this.entity.vx += ivx / this.entity.mass;
    this.entity.vy += ivy / this.entity.mass;

    // Modify rotational velocity
    const cross = px * ivy - py * ivx;
    this.entity.rv += cross / this.entity.I;
  }
  /* eslint-enable class-methods-use-this, no-unused-vars */
}

export default CollisionBase;

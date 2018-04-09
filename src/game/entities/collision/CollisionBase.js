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
  // Check if we are colliding with another entity. UNUSED
  isColliding(otherEntity, dt) {}

  // Resolve a collision with another entity.
  resolveCollision(otherEntity, dt) {}

  /* eslint-enable class-methods-use-this, no-unused-vars */

  /*
  Perform a collision between two collision objects.
  p is the collision point
  c is the collision normal (normal to edge) (normalized into n)
  */
  collide(other, px, py, cx, cy, dt) {
    // const restitution = 0.5; // TODO: calc from objects
    const restitution = this.entity.restitution * other.entity.restitution;

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
    const vdy = r2vy - r1vy;
    const cv = nx * vdx + ny * vdy;
    // if contact velocity is positive, do nothing
    if (cv <= 0) {
      const cn1 = r1x * ny - r1y * nx;
      const cn2 = r2x * ny - r2y * nx;
      const massInverseSum = 1 / this.entity.mass + 1 / other.entity.mass;
      const impulseInertiaSum = cn1 * cn1 / this.entity.I + cn2 * cn2 / other.entity.I;
      let impulseSize = -(1 + restitution) * cv;
      impulseSize /= massInverseSum + impulseInertiaSum;
      const ix = nx * impulseSize;
      const iy = ny * impulseSize;
      this.applyImpulse(r1x, r1y, -ix, -iy);
      other.applyImpulse(r2x, r2y, ix, iy);

      // normal tangent
      let tx = vdx - cv * nx;
      let ty = vdy - cv * ny;
      const tl = Math.sqrt(tx * tx + ty * ty);
      tx /= tl;
      ty /= tl;
      const tn1 = r1x * ty - r1y * tx;
      const tn2 = r2x * ty - r2y * tx;
      const tv = tx * vdx + ty * vdy;
      const frictionInertiaSum = tn1 * tn1 / this.entity.I + tn2 * tn2 / other.entity.I;
      let frictionSize = -(1 + restitution) * tv;
      frictionSize /= massInverseSum + frictionInertiaSum;

      // Prettier could not handle this inside the sqrt function
      const fss =
        this.entity.staticFriction * this.entity.staticFriction +
        other.entity.staticFriction * other.entity.staticFriction;
      const mu = Math.sqrt(fss);

      let fx;
      let fy;
      if (Math.abs(frictionSize) < impulseSize * mu) {
        fx = frictionSize * tx;
        fy = frictionSize * ty;
      } else {
        const fds =
          this.entity.dynamicFriction * this.entity.dynamicFriction +
          other.entity.dynamicFriction * other.entity.dynamicFriction;
        const dmu = Math.sqrt(fds);
        fx = -impulseSize * dmu * tx;
        fy = -impulseSize * dmu * ty;
      }

      this.applyImpulse(r1x, r1y, -fx, -fy);
      other.applyImpulse(r2x, r2y, fx, fy);
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
}

export default CollisionBase;

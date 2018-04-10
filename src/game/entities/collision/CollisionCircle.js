import CollisionBase from './CollisionBase';

/*
Circle collision class
*/
class CollisionCircle extends CollisionBase {
  constructor(radius) {
    super();
    this.radius = radius;

    this.debugtime = 0;
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */

  /* eslint-enable class-methods-use-this, no-unused-vars */

  // Tell the other collision object to resolve a collision with a circle.
  checkCollision(other, dt) {
    other.resolveCircleCollision(this, dt);
  }

  // Resolve a collision with a circle.
  resolveCircleCollision(circle, dt) {
    const [x, y] = this.entity.getNextPosition(dt);
    const [x2, y2] = circle.entity.getNextPosition(dt);
    const xdif = x2 - x;
    const ydif = y2 - y;
    const sqdist = xdif * xdif + ydif * ydif;
    const rad = this.radius + circle.radius;
    const radsq = rad * rad;
    // compare squared data because sqrt is slow
    if (sqdist <= radsq && sqdist !== 0) {
      const cpx = (x * circle.radius + x2 * this.radius) / rad;
      const cpy = (y * circle.radius + y2 * this.radius) / rad;
      this.collide(circle, cpx, cpy, xdif, ydif, dt);
    }
  }

  // Resolve a collision with a rectangle.
  resolveRectangleCollision(rectangle, dt) {
    const [x, y] = this.entity.getNextPosition(dt);
    const [x2, y2] = rectangle.entity.getNextPosition(dt);
    const xdif = x - x2;
    const ydif = y - y2;
    const [ex, ey, fx, fy] = rectangle.getBases();
    let es = xdif * ex + ydif * ey;
    es = Math.max(-rectangle.halfWidth, Math.min(es, rectangle.halfWidth));
    let fs = xdif * fx + ydif * fy;
    fs = Math.max(-rectangle.halfHeight, Math.min(fs, rectangle.halfHeight));
    const x3 = x2 + ex * es + fx * fs;
    const y3 = y2 + ey * es + fy * fs;
    const xdif2 = x3 - x;
    const ydif2 = y3 - y;

    /*  */

    const sqdist = xdif2 * xdif2 + ydif2 * ydif2;
    if (sqdist <= this.radius * this.radius) {
      this.collide(rectangle, x3, y3, xdif2, ydif2, dt);
    }
  }

  // Resolve a collision with a line.
  resolveLineCollision(line, dt) {
    const [x, y] = this.entity.getNextPosition(dt);
    const [x2, y2] = line.entity.getNextPosition(dt);
    // find closest point on line
    let lx = line.x2 - x2;
    let ly = line.y2 - y2;
    const ls = Math.sqrt(lx * lx + ly * ly);
    lx /= ls;
    ly /= ls;
    const xdif = x - x2;
    const ydif = y - y2;
    let difs = lx * xdif + ly * ydif;
    difs = Math.max(0, Math.min(difs, ls));
    const x3 = x2 + lx * difs;
    const y3 = y2 + ly * difs;
    const xdif2 = x3 - x;
    const ydif2 = y3 - y;
    const sqdist = xdif2 * xdif2 + ydif2 * ydif2;

    /* this.debugtime += dt;
    if (this.debugtime >= 0.1) {
      this.debugtime -= 0.1;
      console.log(x3, y3);
    } */

    if (sqdist <= this.radius * this.radius) {
      this.collide(line, x3, y3, xdif2, ydif2, dt);
    }
  }
}

export default CollisionCircle;

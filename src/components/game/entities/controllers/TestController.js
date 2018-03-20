import EntityController from './EntityController';

/*
Player object controller, will handle taking input from player and modifying their objects.
*/
class TestController extends EntityController {
  constructor(x, y, a, b, c, d) {
    super();

    this.time = 0;
    this.x = x;
    this.y = y;
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  init() {
    this.entity.x = this.x;
    this.entity.y = this.y;
  }

  // Update
  update(dt) {
    this.time += dt;
    this.entity.ax = Math.cos(this.time * this.c) * this.a;
    this.entity.ay = Math.cos(this.time * this.d) * this.b;
  }
}

export default TestController;

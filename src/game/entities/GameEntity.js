/*
Game entity base class
*/
class GameEntity {
  /* eslint-disable class-methods-use-this, no-unused-vars, no-useless-constructor,
  no-empty-function */
  constructor(app) {
    // Position
    this.x = 0;
    this.y = 0;

    // Velocity
    this.vx = 0;
    this.vy = 0;

    // Acceleration
    this.ax = 0;
    this.ay = 0;

    // Rotation
    this.rotation = 0;
    this.rv = 0;

    // Physic properties
    this.mass = 0;
    this.friction = 0;
    this.restitution = 1;
    this.I = 1; // rotational inertia, super important to calculate from the shape of the object!
    this.floorFriction = 0.005;

    // Not implemented
    this.maxVelocity = 100; // Maybe do max kinetic energy?

    // Collision group
    // The entity will only collide with entities with the same group number.
    this.collisionGroup = 0;
  }
  /* eslint-enable class-methods-use-this, no-unused-vars, no-useless-constructor,
  no-empty-function */

  // Update this entity
  update(dt) {
    if (this.controller != null) {
      this.controller.update(dt);
    }
    const frictionMultiplier = 1 - this.floorFriction;
    this.vx *= frictionMultiplier;
    this.vy *= frictionMultiplier;
    this.vx += this.ax * dt;
    this.vy += this.ay * dt;
    // this.px = this.x + this.vx * dt;
    // this.py = this.y + this.vy * dt;

    this.rotation += this.rv * dt;
  }

  // Update this entity's graphics
  graphicUpdate(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.graphic.x = this.x;
    this.graphic.y = this.y;

    this.graphic.rotation = this.rotation;
  }

  // Return the predicted next position
  getNextPosition(dt) {
    return [this.x + this.vx * dt, this.y + this.vy * dt];
  }

  // Set the controller for this object.
  setController(controller) {
    this.controller = controller;
    controller.register(this);
  }

  // Clean up resources used by this entity.
  destroy() {
    // If doing proper resource managment then the texture objects used can also be destroyed
    // by using texture: true and baseTexture: true
    this.graphic.destroy({ children: true });
  }

  // Set the graphic tint
  setColor(color) {
    this.graphic.tint = color;
  }
}

export default GameEntity;

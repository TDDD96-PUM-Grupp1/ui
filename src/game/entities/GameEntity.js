/*
Game entity base class
*/
class GameEntity {
  /* eslint-disable no-unused-vars */
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
    this.staticFriction = 0;
    this.dynamicFriction = 0;
    this.restitution = Math.sqrt(0.5);
    this.I = 1; // rotational inertia, super important to calculate from the shape of the object!
    this.floorFriction = 0.005;

    // Not implemented
    // this.maxVelocity = 100; // Maybe do max kinetic energy?

    // Collision group
    // The entity will only collide with entities with the same group number.
    this.collisionGroup = 0;

    this.listeners = [];
  }

  die() {
    this.listeners.forEach(listener => {
      listener.onDeath(this);
    });
  }

  resetPhysics() {
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
  }

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

    this.rv *= 1 - this.floorFriction;
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
    if (controller !== null) {
      controller.register(this);
    }
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

  addEntityListener(listener) {
    this.listeners.push(listener);
  }

  // Assume all entities aren't players and let the player objects override this.
  /* eslint-disable */
  isPlayer() {
    return false;
  }
  /* eslint-enable */
}

export default GameEntity;

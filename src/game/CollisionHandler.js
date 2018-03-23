/*
Handles collision between entities.
*/
class CollisionHandler {
  constructor(entityHandler) {
    this.entityHandler = entityHandler;

    this.iterations = 3; // maybe up this to 5
  }

  // Handle collisions between entities
  handleCollisions(dt) {
    const groups = {};
    let entity;
    const entities = this.entityHandler.getEntities();
    for (let i = 0; i < entities.length; i += 1) {
      entity = entities[i];
      if (groups[entity.collisionGroup] == null) {
        groups[entity.collisionGroup] = [];
      }
      groups[entity.collisionGroup].push(entity);
    }

    const groupnumbers = Object.keys(groups);
    let group;
    let entity1;
    let entity2;
    // oh javascript why can't you just support for in loops properly
    for (let it = 0; it < this.iterations; it += 1) {
      for (let i = 0; i < groupnumbers.length; i += 1) {
        group = groups[groupnumbers[i]];
        for (let j = 0; j < group.length; j += 1) {
          for (let k = j + 1; k < group.length; k += 1) {
            entity1 = group[j];
            entity2 = group[k];
            // if (entity1.collision.isColliding(entity2, dt)) {
            entity1.collision.resolveCollision(entity2, dt);
            // }
          }
        }
      }
    }
  }
}

export default CollisionHandler;

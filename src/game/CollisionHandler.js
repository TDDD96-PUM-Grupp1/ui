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
    const entities = this.entityHandler.getEntities();
    let entity1;
    let entity2;
    for (let j = 0; j < entities.length; j += 1) {
      entity1 = entities[j];
      if (entity1.colliding) {
        for (let k = j + 1; k < entities.length; k += 1) {
          entity2 = entities[k];
          if (entity2.colliding && entity1.collisionGroup !== entity2.collisionGroup) {
            entity1.collision.checkCollision(entity2.collision, dt);
          }
        }
      }
    }
    /* const groups = {};
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
            entity1.collision.checkCollision(entity2.collision, dt);
          }
        }
      }
    } */
  }
}

export default CollisionHandler;

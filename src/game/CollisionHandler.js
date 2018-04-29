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
    for (let i = 0; i < this.iterations; i += 1) {
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
    }
  }
}

export default CollisionHandler;

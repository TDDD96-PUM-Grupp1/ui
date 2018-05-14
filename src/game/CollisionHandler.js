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
    const walls = this.entityHandler.getWalls();
    let entity1;
    let entity2;
    let i;
    let j;
    let k;
    for (i = 0; i < this.iterations; i += 1) {
      for (j = 0; j < entities.length; j += 1) {
        entity1 = entities[j];
        if (entity1.colliding) {
          for (k = j + 1; k < entities.length; k += 1) {
            entity2 = entities[k];
            if (entity2.colliding && entity1.collisionGroup !== entity2.collisionGroup) {
              entity1.collision.checkCollision(entity2.collision, dt);
            }
          }
        }
        for (k = 0; k < walls.length; k += 1) {
          if (entity1.collisionGroup !== walls[k].collisionGroup) {
            entity1.collision.checkCollision(walls[k].collision, dt);
          }
        }
      }
    }
  }
}

export default CollisionHandler;

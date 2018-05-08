/*
Handles game entities.
*/
class EntityHandler {
  constructor() {
    // List of entites handled by this handler.
    this.entities = [];
    this.walls = [];
  }

  // Update all entities.
  update(dt) {
    this.entities.forEach(entity => {
      entity.update(dt);
    });
    this.walls.forEach(entity => {
      entity.update(dt);
    });
  }

  // Update all the entities graphics.
  updateGraphics(dt) {
    this.entities.forEach(entity => {
      entity.graphicUpdate(dt);
    });
    this.walls.forEach(entity => {
      entity.graphicUpdate(dt);
    });
  }

  // Add an entity to this entity handler.
  register(entity) {
    this.entities.push(entity);
  }

  // Add a wall entity to this entity handler.
  // A wall will always collide with an entity
  registerWall(entity) {
    this.walls.push(entity);
  }

  // Removes an entity from this entity handler.
  unregister(entity) {
    const index = this.entities.indexOf(entity);
    this.entities.splice(index, 1);
  }

  // Removes an entity from this entity handler.
  // Also destroys its graphics.
  unregisterFully(entity) {
    this.unregister(entity);
    entity.destroy();
  }

  // Returns an array containing all entities.
  getEntities() {
    return this.entities;
  }

  // Returns an array containing all wall entities.
  getWalls() {
    return this.walls;
  }

  // Returns an array containing all player entities.
  getPlayers() {
    return this.entities.filter(ent => ent.isPlayer());
  }

  // Destroy all entities and clear the entity list.
  clear() {
    this.entities.forEach(entity => {
      entity.destroy();
    });
    this.walls.forEach(entity => {
      entity.destroy();
    });
    this.entities = [];
    this.walls = [];
  }
}

export default EntityHandler;

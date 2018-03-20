/*
Handles game entities.
*/
class EntityHandler {
  constructor() {
    // List of entites handled by this handler.
    this.entities = [];
  }

  // Update all entities.
  update(dt) {
    let i;
    for (i = 0; i < this.entities.length; i += 1) {
      this.entities[i].update(dt);
    }
  }

  // Update all the entities graphics.
  updateGraphics(dt) {
    let i;
    for (i = 0; i < this.entities.length; i += 1) {
      this.entities[i].graphicUpdate(dt);
    }
  }

  // Add an entity to this entity handler.
  register(obj) {
    this.entities.push(obj);
  }

  // Returns an array containing all entities.
  getEntities() {
    const copy = [];
    let i;
    for (i = 0; i < this.entities.length; i += 1) {
      copy.push(this.entities[i]);
    }
    return copy;
  }

  // Destroy all entities and clear the entity list.
  clear() {
    for (let i = 0; i < this.entities.length; i += 1) {
      this.entities[i].destroy();
    }
    this.entities = [];
  }
}

export default EntityHandler;

/*
Handles game entities.
*/
class EntityHandler {
  constructor() {
    // List of entites handled by this handler
    this.entities = [];
  }

  // Update all entities
  update(dt) {
    let i;
    for (i = 0; i < this.entities.length; i += 1) {
      this.entities[i].update(dt);
    }

    for (i = 0; i < this.entities.length; i += 1) {
      this.entities[i].graphicUpdate(dt);
    }
  }

  register(obj) {
    this.entities.push(obj);
  }
}

export default EntityHandler;

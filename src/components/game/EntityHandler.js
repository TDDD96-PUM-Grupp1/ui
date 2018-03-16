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
  }

  // Update all the entities graphics
  updateGraphics(dt) {
    let i;
    for (i = 0; i < this.entities.length; i += 1) {
      this.entities[i].graphicUpdate(dt);
    }
  }

  register(obj) {
    this.entities.push(obj);
  }

  getEntities() {
    const copy = [];
    let i;
    for (i = 0; i < this.entities.length; i += 1) {
      copy.push(this.entities[i]);
    }
    return copy;
  }
}

export default EntityHandler;

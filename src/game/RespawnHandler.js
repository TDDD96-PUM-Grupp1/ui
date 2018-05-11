// Helper fuction to get entity from a pair of timestamp and entity
function getEntity(timeEntityPair) {
  return timeEntityPair[1];
}

// Helper fuction to get respawn time from a pair of timestamp and entity
function getRespawnTime(timeEntityPair) {
  return timeEntityPair[0];
}

class RespawnHandler {
  constructor(entityHandler) {
    this.respawnList = [];

    // this.respawnTime = respawnTime;
    this.entityHandler = entityHandler;

    this.respawnListeners = [];
  }

  // Goes through the list of respawns and checks if their respawn time has come,
  // and then notifies respawnListeners about it.
  checkRespawns() {
    if (this.respawnList.length === 0) return;

    const respawns = [];
    const currentTime = new Date();

    this.respawnList.forEach((timeEntityPair, index) => {
      const time = getRespawnTime(timeEntityPair);
      if (time <= currentTime) {
        const entity = getEntity(timeEntityPair);
        respawns.push([index, entity]);
      }
    });

    respawns.forEach(entityIndexPair => {
      this.respawnSpecific(getEntity(entityIndexPair), 0);
    });
  }

  // Returns the index of the given entity in this.respawnList.
  // returns -1 if entity not found.
  getEntityIndex(entity) {
    let index = -1;

    for (let i = 0; i < this.respawnList.length; i += 1) {
      const e = getEntity(this.respawnList[i]);

      if (e === entity) {
        index = i;
        break;
      }
    }

    return index;
  }

  // Notifies respawnListeners of a specific entity that should respawn.
  respawnEntity(entity) {
    entity.graphic.visible = true;
    entity.dead = false;
    this.entityHandler.register(entity);
    this.notifyListeners(entity);
  }

  // Respawns an entity and removes it from the respawn list.
  respawnSpecific(entity, index) {
    let i;
    if (typeof index === 'undefined') {
      i = this.getEntityIndex(entity);
    } else {
      i = index;
    }
    this.respawnList.splice(i, 1);
    this.respawnEntity(entity);
  }

  // Respawns all entities in the respawn list.
  respawnAll() {
    this.respawnList.forEach(timeEntityPair => {
      const entity = getEntity(timeEntityPair);
      this.respawnEntity(entity);
    });

    this.respawnList = [];
  }

  // Notify listeners that the given entity has respawned.
  notifyListeners(entity) {
    this.respawnListeners.forEach(listener => {
      listener.onRespawn(entity);
    });
  }

  // Registers an entity to respawn in respawnDelay seconds
  addRespawn(entity, respawnDelay) {
    // Kill entity
    this.entityHandler.unregister(entity);
    entity.graphic.visible = false;
    entity.resetPhysics();

    let respawnTime;
    if (typeof respawnDelay !== 'undefined') {
      respawnTime = new Date();
      respawnTime.setSeconds(respawnTime.getSeconds() + respawnDelay);
    } else {
      throw new Error('Undefined respawn time');
    }

    this.respawnList.push([respawnTime, entity]);
  }

  registerRespawnListener(listener) {
    this.respawnListeners.push(listener);
  }

  // Destroy entities waiting on respawn and disconnect listeners.
  clean() {
    this.respawnList.forEach(entity => {
      entity.destroy();
    });
    this.respawnList = [];
    this.respawnListeners = [];
  }

  /*
   * Destroy all respawn timers for the given entity
   * @param entity - the entity to stop from respawning
   */
  removeRespawns(entity) {
    const index = this.getEntityIndex(entity);

    if (index !== -1) {
      this.respawnList.splice(index, 1);
    }
  }
}

export default RespawnHandler;

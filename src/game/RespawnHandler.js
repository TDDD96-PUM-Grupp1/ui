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
  // Throws an error if entity not found.
  getEntityIndex(entity) {
    let index = -1;

    for (let i = 0; i < this.respawnList.length; i += 1) {
      const e = getEntity(this.respawnList[i]);

      if (e === entity) {
        index = i;
        break;
      }
    }

    if (index === -1) {
      throw new Error('Entity not found in respawn list.');
    }
  }

  // Notifies respawnListeners of a specific entity that should respawn.
  respawnSpecific(entity, index) {
    let i;
    if (typeof index === 'undefined') {
      i = this.getEntityIndex(entity);
    } else {
      i = index;
    }
    this.respawnList.splice(i, 1);
    entity.graphic.visible = true;
    this.entityHandler.register(entity);

    this.notifyListeners(entity);
  }

  // Respawns all entities in the respawn list.
  respawnAll() {
    this.respawnList.forEach(timeEntityPair => {
      const entity = getEntity(timeEntityPair);
      entity.graphic.visible = true;
      this.entityHandler.register(entity);

      this.notifyListeners(entity);
    });

    this.respawnList = [];
  }

  // Notify listeners that the given entity has respawned.
  notifyListeners(entity) {
    this.respawnListeners.forEach(listener => {
      listener.onRespawn(entity);
    });
  }

  // Registers a new death in the respawn list.
  // If timeOfDeath is given, the entity will be set to respawn this.respawnTime
  // seconds after it.
  // If omitted, the respawn time will be set to inf and the entity needs to be
  // manually respawned.
  registerDeath(entity, timeOfDeath) {
    // Kill entity
    this.entityHandler.unregister(entity);
    entity.graphic.visible = false;
    entity.resetPhysics();

    let respawnTime;
    if (typeof timeOfDeath !== 'undefined') {
      respawnTime = new Date();
      respawnTime.setSeconds(timeOfDeath.getSeconds() + this.respawnTime);
    } else {
      respawnTime = Infinity;
    }

    this.respawnList.push([respawnTime, entity]);
  }

  // Registers an entity to respawn in respawnDelay seconds
  // If no delay is specified, it will not respawn automatically
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
      respawnTime = Infinity;
    }

    this.respawnList.push([respawnTime, entity]);
  }

  registerRespawnListener(listener) {
    this.respawnListeners.push(listener);
  }
}

export default RespawnHandler;

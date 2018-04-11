// Helper fuction to get entity from a pair of timestamp and entity
function getEntity(timeEntityPair) {
  return timeEntityPair[1];
}

// Helper fuction to get respawn time from a pair of timestamp and entity
function getRespawnTime(timeEntityPair) {
  return timeEntityPair[0];
}

class RespawnHandler {
  constructor(respawnTime) {
    this.respawnList = [];

    this.respawnTime = respawnTime;

    this.respawnListeners = [];
  }

  checkRespawns() {
    if (this.respawnList.length === 0) return;

    let removed = 0;
    const currentTime = new Date();
    this.respawnList.forEach(timeEntityPair => {
      const time = getRespawnTime(timeEntityPair);
      if (time <= currentTime) {
        removed += 1;
        const entitiy = getEntity(timeEntityPair);
        this.respawnListeners.forEach(listener => {
          listener.onRespawn(entitiy);
        });
      }
    });

    this.respawnList = this.respawnList.slice(removed);
  }

  registerDeath(entity) {
    const respawnTime = new Date();
    respawnTime.setSeconds(respawnTime.getSeconds() + this.respawnTime);

    this.respawnList.push([respawnTime, entity]);
  }

  registerRespawnListener(listener) {
    this.respawnListeners.push(listener);
  }
}

export default RespawnHandler;

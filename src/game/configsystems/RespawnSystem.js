import ConfigSystem from './ConfigSystem';

/*
Handles player respawning
*/
class RespawnSystem extends ConfigSystem {
  constructor(handler, options) {
    super(handler, options);

    this.respawnTime = 0;
    this.respawnPhaseTime = 0;
  }

  setup() {
    let { time, phase } = this.options.respawn;
    if (time === undefined) {
      time = 0;
    }
    if (phase === undefined) {
      phase = 0;
    }
    this.respawnTime = time;
    this.respawnPhaseTime = phase;
    // Attach us as a respawn listener so we know when they player has respawned
    this.game.respawnHandler.registerRespawnListener(this);

    return { onPlayerCreated: true };
  }

  onPlayerCreated(playerObject, circle) {
    // Add a death listener so we know when the player has died
    circle.addDeathListener(this.onDeath.bind(this));
  }

  onDeath(entity) {
    // Set the player to respawn but only if they are respawnable and they haven't left the game
    if (!entity.respawnable || entity.playerLeft) {
      this.game.entityHandler.unregisterFully(entity);
    } else {
      this.game.respawnHandler.addRespawn(entity, this.respawnTime);
      // Signal death to controllers
      this.game.communication.signalDeath(entity.controller.id, this.respawnTime);
    }
  }

  onRespawn(entity) {
    // Make the entity phase if the config says so.
    if (this.respawnPhaseTime > 0) {
      entity.phase(this.respawnPhaseTime);
    }
    // If the gamemode has defined an onPlayerRespawn method we call it.
    // If a gamemode has manually added itself as a respawn listener they use the method onRespawn
    // So there is no risk for duplicate calls
    if (this.gamemode.onPlayerRespawn) {
      this.gamemode.onPlayerRespawn(entity);
    }

    // Signal controller that player has respawned
    const { id } = entity.controller;
    this.game.communication.signalRespawn(id);
  }
}

export default RespawnSystem;

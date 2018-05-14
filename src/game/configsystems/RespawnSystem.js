import ConfigSystem from './ConfigSystem';

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
    this.game.respawnHandler.registerRespawnListener(this);

    return { onPlayerCreated: true };
  }

  onPlayerCreated(playerObject, circle) {
    circle.addDeathListener(this.onDeath.bind(this));
  }

  onDeath(entity) {
    if (!entity.respawnable || entity.playerLeft) {
      this.game.entityHandler.unregisterFully(entity);
    } else {
      this.game.respawnHandler.addRespawn(entity, this.respawnTime);
    }
  }

  onRespawn(entity) {
    if (this.respawnPhaseTime > 0) {
      entity.phase(this.respawnPhaseTime);
    }
    if (this.gamemode.onPlayerRespawn) {
      this.gamemode.onPlayerRespawn(entity);
    }
  }
}

export default RespawnSystem;

import ConfigSystem from './ConfigSystem';
import iconData from '../iconData';
import PlayerCircle from '../entities/PlayerCircle';
import PlayerController from '../entities/controllers/PlayerController';

class SpawnSystem extends ConfigSystem {
  constructor(handler, options) {
    super(handler, options);

    this.playerRadius = 32;
    this.joinPhase = 0;
    this.moveWhilePhased = true;
  }

  setup() {
    if (this.options.moveWhilePhased !== undefined) {
      this.moveWhilePhased = this.options.moveWhilePhased;
    }
    if (this.options.playerRadius !== undefined) {
      this.playerRadius = this.options.playerRadius;
    }
    if (this.options.joinPhase !== undefined) {
      this.joinPhase = this.options.joinPhase;
    }
    return { onPlayerJoin: true, onPlayerCreated: true };
  }

  onPlayerJoin(playerObject) {
    const { iconID, id } = playerObject;

    return new Promise(resolve => {
      this.game.resourceServer
        .requestResources([{ name: iconData[iconID].name, path: iconData[iconID].img }])
        .then(resources => {
          const circle = new PlayerCircle(
            this.game,
            resources[iconData[iconID].name],
            this.playerRadius
          );
          const controller = new PlayerController(this.game, id);
          circle.setController(controller);
          const backgroundCol = Number.parseInt(playerObject.backgroundColor.substr(1), 16);
          const iconCol = Number.parseInt(playerObject.iconColor.substr(1), 16);

          circle.setColor(backgroundCol, iconCol);

          this.gamemode.players[id] = circle;
          this.game.register(circle);

          this.gamemode.onPlayerCreated(playerObject, circle);

          resolve(circle);
        });
    });
  }

  onPlayerCreated(playerObject, circle) {
    circle.phase(this.joinPhase);
    circle.moveWhilePhased = this.moveWhilePhased;
  }
}

export default SpawnSystem;

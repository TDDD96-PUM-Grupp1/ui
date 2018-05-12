import ConfigSystem from './ConfigSystem';
import iconData from '../iconData';
import PlayerCircle from '../entities/PlayerCircle';
import PlayerController from '../entities/controllers/PlayerController';

// TODO: Figure out how this is going to work :S
class SpawnSystem extends ConfigSystem {
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
}

export default SpawnSystem;

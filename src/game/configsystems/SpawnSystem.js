import ConfigSystem from './ConfigSystem';
import iconData from '../iconData';
import PlayerCircle from '../entities/PlayerCircle';
import PlayerController from '../entities/controllers/PlayerController';

/*
Handles player spawning
*/
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
    return { onPlayerJoin: true, onPlayerCreated: true, onPlayerLeave: true };
  }

  onPlayerJoin(playerObject) {
    const { iconID, id } = playerObject;

    // Return a promise since we load the texture async
    return new Promise(resolve => {
      this.game.resourceServer
        .requestResources([{ name: iconData[iconID].name, path: iconData[iconID].img }])
        .then(resources => {
          const circle = new PlayerCircle(
            this.game,
            resources[iconData[iconID].name],
            this.playerRadius
          );
          // Attach a player controller to the circle so the player can control it
          const controller = new PlayerController(this.game, id);
          circle.setController(controller);

          // Set the players colors
          const backgroundCol = Number.parseInt(playerObject.backgroundColor.substr(1), 16);
          const iconCol = Number.parseInt(playerObject.iconColor.substr(1), 16);
          circle.setColor(backgroundCol, iconCol);

          // Add the player to the player lists
          this.gamemode.players[id] = circle;
          this.handler.players[id] = circle;
          // Add the player circle to the game
          this.game.register(circle);

          // Tell the gamemode (and other systems) that the player entity is ready
          this.gamemode.onPlayerCreated(playerObject, circle);

          resolve(circle);
        });
    });
  }

  onPlayerCreated(playerObject, circle) {
    circle.phase(this.joinPhase);
    circle.moveWhilePhased = this.moveWhilePhased;
  }

  onPlayerLeave(id) {
    delete this.gamemode.players[id];
    delete this.handler.players[id];
  }
}

export default SpawnSystem;

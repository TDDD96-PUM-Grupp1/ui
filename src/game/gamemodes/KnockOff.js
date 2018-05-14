import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';

/*
  Knock off gamemode, get score by knocking other players off the arena.
*/
class KnockOff extends Gamemode {
  constructor(game, resources) {
    super(game, resources);

    this.arenaRadius = 400;
    this.respawnArea = 100;

    this.scaleHeight = this.arenaRadius * 2 + 50;

    // Set up arena graphic
    const graphic = new PIXI.Sprite(resources.arena);
    game.gameStage.addChildAt(graphic, 0);
    this.arenaGraphic = graphic;

    const border = new PIXI.Graphics();
    border.lineStyle(5, 0xff0101);
    border.drawCircle(0, 0, graphic.width * 0.5 + 2);
    border.endFill();
    graphic.addChild(border);

    graphic.width = this.arenaRadius * 2;
    graphic.height = this.arenaRadius * 2;
    graphic.anchor.set(0.5, 0.5);
    graphic.x = 0;
    graphic.y = 0;
  }

  /* eslint-disable no-unused-vars, class-methods-use-this */

  // Called after the game objects are updated.
  postUpdate(dt) {
    this.game.entityHandler.getPlayers().forEach(entity => {
      if (!entity.dead) {
        const dx = this.arenaGraphic.x - entity.x;
        const dy = this.arenaGraphic.y - entity.y;
        const centerDist = Math.sqrt(dx * dx + dy * dy);

        if (centerDist > this.arenaRadius - entity.radius) {
          entity.die();
        }
      }
    });
  }

  /* eslint-enable no-unused-vars, class-methods-use-this */

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    // Place them in the middle of the arena for now
    circle.x = this.arenaGraphic.x;
    circle.y = this.arenaGraphic.y;
  }

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.arenaGraphic.destroy();
  }

  // Called when an entity is respawned.
  onRespawn(entity) {
    // Move the entity close to the center
    entity.x = this.arenaGraphic.x + Math.cos(Math.random() * Math.PI * 2) * this.respawnArea;
    entity.y = this.arenaGraphic.y + Math.sin(Math.random() * Math.PI * 2) * this.respawnArea;
  }
}

export default KnockOff;

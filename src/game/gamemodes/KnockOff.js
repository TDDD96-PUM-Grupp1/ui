import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';

/*
  Knock off gamemode, get score by knocking other players off the arena.
*/
class KnockOff extends Gamemode {
  constructor(game, resources) {
    super(game, resources);

    this.arenaRadius = 490;
    this.respawnArea = 100;

    // Center arena
    this.arenaCenterx = Math.round(window.innerWidth / 2);
    this.arenaCentery = Math.round(window.innerHeight / 2);

    // Set up arena graphic
    const graphic = new PIXI.Sprite(resources.arena);
    game.app.stage.addChildAt(graphic, 0);
    this.arenaGraphic = graphic;

    const border = new PIXI.Graphics();
    border.lineStyle(5, 0xff0101);
    border.drawCircle(0, 0, graphic.width * 0.5 + 2);
    border.endFill();
    graphic.addChild(border);

    graphic.width = this.arenaRadius * 2;
    graphic.height = this.arenaRadius * 2;
    graphic.anchor.set(0.5, 0.5);
    graphic.x = this.arenaCenterx;
    graphic.y = this.arenaCentery;
  }

  /* eslint-disable no-unused-vars, class-methods-use-this */

  // Called before the game objects are updated.
  preUpdate(dt) {}

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

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    const { iconID } = playerObject;
    const idTag = playerObject.id;

    // Place them in the middle of the arena for now
    circle.x = this.arenaCenterx;
    circle.y = this.arenaCentery;
  }

  onButtonPressed(id, button) {}

  /* eslint-enable class-methods-use-this, no-unused-vars */

  // Clean up after the gamemode is finished.
  cleanUp() {
    this.arenaGraphic.destroy();
  }

  // Called when an entity is respawned.
  onRespawn(entity) {
    // Move the entity close to the center
    entity.x = this.arenaCenterx + Math.cos(Math.random() * Math.PI * 2) * this.respawnArea;
    entity.y = this.arenaCentery + Math.sin(Math.random() * Math.PI * 2) * this.respawnArea;
  }

  // Called when an entity dies.
  // eslint-disable-next-line
  onDeath(entity) {}

  onWindowResize() {
    const newCenterX = Math.round(window.innerWidth / 2);
    const newCenterY = Math.round(window.innerHeight / 2);

    // Calculate diff in x and y before moving everything
    const dx = this.arenaGraphic.x - newCenterX;
    const dy = this.arenaGraphic.y - newCenterY;

    this.arenaGraphic.x = newCenterX;
    this.arenaGraphic.y = newCenterY;

    this.arenaCenterx = newCenterX;
    this.arenaCentery = newCenterY;

    this.game.entityHandler.getEntities().forEach(entity => {
      entity.x -= dx;
      entity.y -= dy;
    });
  }
}

export default KnockOff;

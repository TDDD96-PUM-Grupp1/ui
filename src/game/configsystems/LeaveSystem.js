import * as PIXI from 'pixi.js';
import ConfigSystem from './ConfigSystem';

/*
Handles abilities.
*/
class LeaveSystem extends ConfigSystem {
  constructor(handler, options) {
    super(handler, options);

    this.removeTime = 5;
    this.dyingEntities = [];
  }

  setup() {
    if (this.options.leave) {
      if (this.options.leave.removeTime) {
        this.removeTime = this.options.leave.removeTime;
      }
    }
    return { preUpdate: true, onPlayerLeave: true };
  }

  preUpdate(dt) {
    // Remove dead entities so they are not killed several times
    this.dyingEntities = this.dyingEntities.filter(val => !val.entity.dead);

    let entity;
    let timer;
    // Check for entities whose time has ran out
    while (this.dyingEntities.length > 0) {
      [{ entity, timer }] = this.dyingEntities;
      if (timer - dt <= 0) {
        // Remove from list
        this.dyingEntities.shift();

        // Kill entity instead of deleting so things are more standardised.
        entity.die();
      } else {
        break;
      }
    }
    // Update dying entities
    this.dyingEntities.forEach(item => {
      item.timer -= dt;
      // Update indicator scale
      let scale = (this.removeTime - item.timer) / this.removeTime;
      scale *= scale;
      item.indicator.scale.set(scale, scale);
    });
  }

  // Turn the players entity into a dummy, leaving it in the game for a bit before killing it
  onPlayerLeave(id) {
    const entity = this.handler.getPlayerEntity(id);

    if (entity.dead) {
      // In case the players entity is currently in the respawn handler
      // we mark it so that it will not respawn
      entity.respawnable = false;
      return;
    }

    // Mark that the player has left, this flag should be looked at
    // by gamemodes so that the player will not be made special
    entity.playerLeft = true;
    // Make the controller passive so that if the player connects again they can't control it
    entity.controller.active = false;
    // Clear collision listeners so that the entity will not keep tagging players
    // Gamemodes can cleverly utilize this to prevent entity from becoming special
    entity.collision.listeners = [];

    // Color it gray so it is clear that it is no longer controlled.
    entity.setColor(0x888888, 0x888888);
    // Hide the icon
    // entity.graphic.getChildAt(0).visible = false;

    // Attach an indicator that shows how close the entity is to being killed,
    // so that players are ready for it to disappear.
    // Currently done as a darkness expanding from inside the player circle
    const indicator = new PIXI.Sprite(this.game.basicResources.circle);
    indicator.anchor.set(0.5, 0.5);
    indicator.alpha = 0.4;
    indicator.tint = 0x000000;
    entity.graphic.addChild(indicator);

    this.dyingEntities.push({ entity, indicator, timer: this.removeTime });
  }
}

export default LeaveSystem;

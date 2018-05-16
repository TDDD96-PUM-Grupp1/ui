import ConfigSystem from './ConfigSystem';

/*
Handles kill tracking through tagging
*/
class KillSystem extends ConfigSystem {
  constructor(handler, options) {
    super(handler, options);

    this.tagTime = 0;
    this.tags = {};
  }

  setup() {
    const { tag } = this.options.kill;
    this.tagTime = tag.tagTime;

    // Add the 'kill' hook to let other systems be notified when a kill occurs
    this.handler.addHook('kill');

    return { preUpdate: true, onPlayerCreated: true, onPlayerLeave: true };
  }

  preUpdate(dt) {
    // Decrement all tags on all players
    // The tags are assumed to be in chronological order
    Object.keys(this.tags).forEach(id => {
      const list = this.tags[id];
      while (list.length > 0) {
        if (list[0].timer - dt <= 0) {
          // Remove expired tag
          list.shift();
        } else {
          break;
        }
      }
      list.forEach(item => {
        item.timer -= dt;
      });
    }, this);
  }

  onPlayerCreated(playerObject, circle) {
    const { id } = playerObject;
    this.tags[id] = [];
    // Add a collision listener that will add a tag to the victim on collision
    circle.collision.addListener((player, victim) => {
      if (victim.isPlayer()) {
        const vid = victim.controller.id;
        const pid = player.controller.id;
        // Remove any previous tag we still had so the chronological order is ensured
        this.tags[vid] = this.tags[vid].filter(e => e.id !== pid);
        this.tags[vid].push({ id: pid, timer: this.tagTime });
      }
    });
    // Add a death listener to the player
    circle.addDeathListener(this.onDeath.bind(this));
  }

  onDeath(entity) {
    const { id } = entity.controller;
    // Every tag the player had counts as a kill.
    this.tags[id].forEach(item => {
      // Notify other systems
      this.handler.triggerHook('kill', { killer: item.id, victim: id });
    });
    this.tags[id] = [];
  }

  onPlayerLeave(id) {
    // Clear the players tags
    this.tags[id] = [];
  }
}

export default KillSystem;

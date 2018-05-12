import ConfigSystem from './ConfigSystem';

class KillSystem extends ConfigSystem {
  constructor(handler, options) {
    super(handler, options);

    this.tagTime = 0;
    this.tags = {};
  }

  setup() {
    const { tag } = this.options.kill;
    this.tagTime = tag.tagTime;

    return { preUpdate: true, onPlayerCreated: true, onPlayerLeave: true };
  }

  preUpdate(dt) {
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
    circle.collision.addListener((player, victim) => {
      if (victim.isPlayer()) {
        const vid = victim.controller.id;
        const pid = player.controller.id;
        this.tags[vid] = this.tags[vid].filter(e => e.id !== pid);
        this.tags[vid].push({ id: pid, timer: this.tagTime });
      }
    });
    circle.addDeathListener(this.onDeath.bind(this));
  }

  onDeath(entity) {
    const { id } = entity.controller;
    this.tags[id].forEach(item => {
      console.log('%s killed %s', item.id, id);
      // Highscore stuff
      /*
        this.onKillEvents.forEach(event => {
          const { name, action } = event;
          this.game.scoreManager.mutateScore(name, item.id, action);
        });
        */
    });
    this.tags[id] = [];
  }

  onPlayerLeave(id) {
    this.tags[id] = [];
  }
}

export default KillSystem;

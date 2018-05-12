import ConfigSystem from './ConfigSystem';

class AbilitySystem extends ConfigSystem {
  constructor(handler, options) {
    super(handler, options);

    this.abilities = [];
  }

  setup() {
    this.options.abilities.forEach(ability => {
      ability.timers = {};
    });
    this.abilities = this.options.abilities;
    this.game.setUpGameButtons(this.options.abilities);

    return { preUpdate: true, onPlayerCreated: true, onButtonPressed: true };
  }

  preUpdate(dt) {
    Object.keys(this.abilities).forEach(button => {
      const { cooldown, duration, deactivateFunc } = this.abilities[button];
      Object.keys(this.abilities[button].timers).forEach(id => {
        const timer = this.abilities[button].timers[id];
        if (timer.onCooldown) {
          timer.time -= dt;
          if (timer.active && timer.time <= cooldown - duration) {
            deactivateFunc(this.gamemode.players[id], this.gamemode.resources, this.game);
            timer.active = false;
          } else if (timer.time <= 0) {
            // Cooldown over, tell controller
            this.game.communication.resetCooldown(id, button);
            timer.onCooldown = false;
          }
        }
      });
    });
  }

  onPlayerCreated(playerObject) {
    const { id } = playerObject;
    Object.keys(this.abilities).forEach(button => {
      this.abilities[button].timers[id] = { active: false, time: 0 };
    });
  }

  onButtonPressed(id, button) {
    if (this.abilities[button]) {
      const ability = this.abilities[button];
      const playerEntity = this.handler.getPlayerEntity(id);
      if (ability.timers[id].time <= 0) {
        ability.activateFunc(playerEntity, this.gamemode.resources, this.game);
        ability.timers[id].time = ability.cooldown;
        ability.timers[id].active = true;
        ability.timers[id].onCooldown = true;
      }
    }
  }
}

export default AbilitySystem;

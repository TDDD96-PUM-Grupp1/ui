import ConfigSystem from './ConfigSystem';

class Abilities extends ConfigSystem {
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

  onPlayerCreated(playerObject, circle) {
    const { id } = playerObject;
    Object.keys(this.abilities).forEach(button => {
      this.abilities[button].timers[id] = { active: false, time: 0 };
    });
  }

  onButtonPressed(id, button) {
    if (this.abilities[button]) {
      const ability = this.abilities[button];
      const playerEntity = this.gamemode.players[id];
      if (ability.timers[id].time <= 0) {
        ability.activateFunc(playerEntity, this.gamemode.resources, this.game);
        ability.timers[id].time = ability.cooldown;
        ability.timers[id].active = true;
        ability.timers[id].onCooldown = true;
      }
    }
  }
}

export default Abilities;

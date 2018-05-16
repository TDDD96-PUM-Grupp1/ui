import ConfigSystem from './ConfigSystem';

/*
Handles abilities.
*/
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

    return {
      preUpdate: true,
      onPlayerCreated: true,
      onButtonPressed: true,
      onPlayerLeave: true,
    };
  }

  deactivateAbility(button, id) {
    const timer = this.abilities[button].timers[id];
    const { deactivateFunc } = this.abilities[button];

    // If abilitiy is currently active, disable it
    if (timer.active) {
      deactivateFunc(this.gamemode.players[id], this.gamemode.resources, this.game);
      timer.active = false;
    }
  }

  preUpdate(dt) {
    // Decrement the timer on all abilities
    Object.keys(this.abilities).forEach(button => {
      const { cooldown, duration } = this.abilities[button];
      Object.keys(this.abilities[button].timers).forEach(id => {
        const timer = this.abilities[button].timers[id];
        if (timer.onCooldown) {
          timer.time -= dt;
          // If active time has run out, then we deactivate
          if (timer.active && timer.time <= cooldown - duration) {
            this.deactivateAbility(button, id);
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
    // Allocate timer for every ability for the player
    Object.keys(this.abilities).forEach(button => {
      this.abilities[button].timers[id] = { active: false, time: 0 };
    });

    // Set up a death listener
    circle.addDeathListener(this.onDeath.bind(this));
  }

  onButtonPressed(id, button) {
    // Check if the ability isn't on cooldown and activate it
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

  onDeath(entity) {
    // If player has left we have already cleared their timers,
    // and we should for sure not signal the controller
    if (entity.playerLeft) {
      return;
    }

    const { id } = entity.controller;

    // Reset all abilities
    Object.keys(this.abilities).forEach(button => {
      this.deactivateAbility(button, id);

      // Completely reset timer
      const timer = this.abilities[button].timers[id];
      timer.onCooldown = false;
      timer.time = 0;
    });

    // Signal death to controllers
    this.game.communication.signalDeath(id, this.respawnTime);
  }

  onPlayerLeave(id) {
    // Remove player from all ability timers
    Object.keys(this.abilities).forEach(button => {
      this.deactivateAbility(button, id);
      delete this.abilities[button].timers[id];
    });
  }
}

export default AbilitySystem;

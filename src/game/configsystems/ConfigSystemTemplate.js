/* eslint-disable no-useless-constructor, class-methods-use-this, no-unused-vars */
import ConfigSystem from './ConfigSystem';

class ConfigSystemTemplate extends ConfigSystem {
  constructor(handler, options) {
    // Always call super!
    // super sets up `this.game`, `this.gamemode`, `this.handler`, `this.options`
    super(handler, options);

    // It should be safe to have consequences here, just remember to remove them in the clean method
  }

  // Set up the system according to the gamemode's options
  setup(handler) {
    // These flags tell the config handler which events this system needs.
    // While they can all just be enabled, it is best practice to turn them
    // on according to what is needed from the options.
    // These events are the same that gamemodes use.
    const binds = {
      onPlayerCreated: false,
      onPlayerLeave: false,
      preUpdate: false,
      postUpdate: false,
      onButtonPressed: false,
    };

    // Options should be accessed through `this.options`

    // In here you should also setup any event hooks with the handler,
    // potentially setup different hooks depending on options
    // handler.addHook('name');

    return binds;
  }

  // Called after all systems have been set up
  attachHooks() {
    // Here you should attach to any hooks that you need (depending on the options)
    // The hooks essentially form an arbitrary listener system that allows systems to communicate
    // this.handler.hookUp('name', this.onName.bind(this));
  }

  // Called before the physics update
  preUpdate(dt) {}

  // Called after the physics update
  postUpdate(dt) {}

  // Called when a player joins the game but after they have had an entity created
  onPlayerCreated(playerObject, circle) {}

  // Called when a player leaves the game
  onPlayerLeave(id) {}

  // Called when a player presses a button
  onButtonPressed(id, button) {}

  // Clean up any consequences left by the system
  clean() {}
}
export default ConfigSystemTemplate;

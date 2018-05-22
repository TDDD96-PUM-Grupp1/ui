/* eslint-disable no-useless-constructor, class-methods-use-this, no-unused-vars */

/*
Base class for the config systems.
*/
class ConfigSystem {
  constructor(handler, options) {
    this.game = handler.game;
    this.gamemode = handler.gamemode;
    this.handler = handler;
    this.options = options;
  }

  // Configure system from options, set up hooks and return the events it will need to listen to
  setup(handler) {}

  // Attach listener to the needed hooks
  attachHooks() {}

  // Clean up consequences
  clean() {}

  // Called before the physics update
  preUpdate(dt) {}

  // Called after the physics update
  postUpdate(dt) {}

  // Called when a player joins the game
  // Should return a promise, create an entity for the player
  // and call onPlayerCreated on the gamemode
  onPlayerJoin(playerObject) {}

  // Called when a player joins the game but after they have had an entity created
  onPlayerCreated(playerObject, circle) {}

  // Called when a player leaves the game
  onPlayerLeave(id) {}

  // Called when a player presses a button
  onButtonPressed(id, button) {}

  // Clean up any consequences left by the system
  clean() {}
}
export default ConfigSystem;

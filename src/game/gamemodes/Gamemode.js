/*
Gamemode base class.
*/
class Gamemode {
  /* eslint-disable class-methods-use-this, no-unused-vars, no-useless-constructor,
  no-empty-function */
  constructor(game, resources) {
    this.game = game;
    this.resources = resources;
    this.onButtonPressed = this.onButtonPressed.bind(this);

    this.scaleHeight = 1000;

    this.players = {};
  }

  // Return a list of the resources the gamemode will use.
  static getResources() {
    return [];
  }

  // Return the config for the gamemode.
  static getConfig() {
    return {};
  }

  init() {}
  /* eslint-enable class-methods-use-this, no-unused-vars, no-useless-constructor,
  no-empty-function */

  /* eslint-disable class-methods-use-this, no-unused-vars */
  // Called before the game objects are updated and physics are calculated.
  preUpdate(dt) {}

  // Called after physics calculation but before the graphics is updated.
  postUpdate(dt) {}

  // Called when a new player connects
  onPlayerJoin(playerObject) {}

  // Called after a player has joined and their circle has been created.
  onPlayerCreated(playerObject, circle) {}

  // Called when a player disconnects
  onPlayerLeave(idTag) {}

  onButtonPressed(id, button) {}

  // Called when the window is resized
  onWindowResize() {}

  // Clean up after the gamemode is finished.
  cleanUp() {}
  /* eslint-enable class-methods-use-this, no-unused-vars */
}

export default Gamemode;

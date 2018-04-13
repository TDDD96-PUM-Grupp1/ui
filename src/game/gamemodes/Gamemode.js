/*
Gamemode base class.
*/
class Gamemode {
  /* eslint-disable class-methods-use-this, no-unused-vars, no-useless-constructor,
  no-empty-function */
  constructor(game) {
    this.game = game;
  }
  /* eslint-enable class-methods-use-this, no-unused-vars, no-useless-constructor,
  no-empty-function */

  /* eslint-disable class-methods-use-this, no-unused-vars */
  // Called before the game objects are updated and physics are calculated.
  preUpdate(dt) {}

  // Called after physics calculation but before the graphics is updated.
  postUpdate(dt) {}

  // Called when a new player connects
  onPlayerJoin(idTag, iconID) {}

  // Called when a player disconnects
  onPlayerLeave(idTag) {}

  // Clean up after the gamemode is finished.
  cleanUp() {}
  /* eslint-enable class-methods-use-this, no-unused-vars */
}

export default Gamemode;

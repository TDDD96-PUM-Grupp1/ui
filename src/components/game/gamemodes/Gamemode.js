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
  // Called before the game objects are updated.
  preUpdate(dt) {}

  // Called after the game objects are updated.
  postUpdate(dt) {}

  // Clean up after the gamemode is finished.
  cleanUp() {}
  /* eslint-enable class-methods-use-this, no-unused-vars */
}

export default Gamemode;

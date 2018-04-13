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
  onPlayerJoin(idTag) {}

  // Called when a player disconnects
  onPlayerLeave(idTag) {
    const entities = this.game.entityHandler.getEntities().slice();

    for (let i = 0; i < entities.length; i += 1) {
      const currentEntity = entities[i];
      if (
        typeof currentEntity.controller !== 'undefined' &&
        currentEntity.controller.id === idTag
      ) {
        this.game.entityHandler.unregisterFully(currentEntity);
        return;
      }
    }
  }

  // Clean up after the gamemode is finished.
  cleanUp() {}
  /* eslint-enable class-methods-use-this, no-unused-vars */
}

export default Gamemode;

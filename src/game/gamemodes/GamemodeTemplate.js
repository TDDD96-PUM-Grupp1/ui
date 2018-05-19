/* eslint-disable no-useless-constructor, class-methods-use-this, no-unused-vars */
import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';

// Used to configure the highscore list
import { HighscoreEnums } from '../configsystems/HighscoreSystem';

/*
Gamemode template.
*/
class GamemodeTemplate extends Gamemode {
  constructor(game, resources) {
    // Always call super!
    // super sets up `this.game`, `this.resources`, `this.players`, `this.scaleHeight`
    // this.scaleHeight defaults to 1000 pixels, depending on the gamemode,
    // the value should be changed to keep the scale of the game reasonable.
    // this.players is a dictionary that maps player id to their entity and
    // is used by many things, best to treat it as read-only.
    super(game, resources);

    // It is OK to create consequences here (create graphics, entities, etc)
    // just remember to clean them up in the clean method
  }

  // Return a list of the resources the gamemode will use.
  static getResources() {
    // The images that will be used should be listed here
    // These will be accesible in `this.resources` with the specified name
    // The path starts from the public/resources folder
    return [
      // { name: 'name', path: 'subfolder/image.png' },
    ];
  }

  // Return the config for the gamemode.
  static getConfig() {
    // See the config wiki
    return {};
  }

  // Called before the game objects are updated and physics are calculated.
  preUpdate(dt) {
    // This is the first of the two update methods.
    // This one should be used for things that will affect the physics
    // like changing velocities and killing entities.
  }

  // Called after physics calculation but before the graphics is updated.
  postUpdate(dt) {
    // This is the second of the two update methods.
    // This one should be used for doing things depending on the outcome of physics
    // like checking positions.
    // The graphic update happens after this so it can be a good idea to spawn entities here
    // which will let players see them for 1 frame before they collide.
  }

  // Called after a player has joined and their circle has been created.
  onPlayerCreated(playerObject, circle) {
    // The playerObject contains the data sent from the controller,
    // things like name, colors, iconId, id.
    // The circle is the player's entity, here is a good place to attach any listeners
    // and move it to a spawn location. ((0, 0) is the center of the screen)
  }

  // Called when a player disconnects
  onPlayerLeave(id) {
    // The player's entity will be automatically removed by the LeaveSystem.
    // But if you have any references to players, you probably want to remove them here.
  }

  // Called when a player presses a button.
  onButtonPressed(id, button) {
    // In the config you can setup abilities to work nicely with the controller
    // But here you can make other things happen on button presses if you want.
  }

  // Called when the window is resized
  onWindowResize() {
    // Here you should update things that depend on the screen size.
    // The gameStage is scaled so that the height is always equal to `this.scaleHeight`
    // So the width will likely have changed.
    // You can get the width and height from
    // `this.game.gameStageWidth` and `this.game.gameStageHeight`
    // Typical thing is to change the position of walls preventing things from leaving the screen
  }

  // Clean up after the gamemode is finished.
  cleanUp() {
    // Here you should clean up any custom graphics added to the stage
    // You don't have to care about cleaning up any entities
  }

  // Called after config systems have been loaded
  attachHooks(handler) {
    // Here you can attach to hooks setup by the config systems
  }
}

// Remember to change the classname and export!
export default GamemodeTemplate;

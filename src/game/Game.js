// import * as PIXI from 'pixi.js';
import EntityHandler from './EntityHandler';
import CollisionHandler from './CollisionHandler';
import ResourceServer from './ResourceServer';
import GamemodeHandler from './GamemodeHandler';
import ScoreManager from './ScoreManager';

/*
Game.
*/
class Game {
  constructor(app, communication) {
    this.app = app;
    this.communication = communication;
    this.instance = this.communication.getInstance();

    // This will be undefined when running tests since we havn't
    // started an instance.
    if (this.instance !== undefined) {
      this.instance.addInstanceListener(this);
    }

    // Create all handlers
    this.entityHandler = new EntityHandler();
    this.collisionHandler = new CollisionHandler(this.entityHandler);
    this.resourceServer = new ResourceServer();
    this.scoreManager = new ScoreManager();

    // Create gamemode
    const gamemodeHandler = GamemodeHandler.getInstance();
    const SelectedMode = gamemodeHandler.getSelected();
    this.currentGamemode = new SelectedMode(this);
  }

  // Main game loop
  loop(delta) {
    // Convert frame delta to time delta [second] (assuming 60fps)
    const dt = delta / 60;

    // Update handlers and gamemodes
    this.currentGamemode.preUpdate(dt);
    this.entityHandler.update(dt);
    this.collisionHandler.handleCollisions(dt);
    this.currentGamemode.postUpdate(dt);
    this.entityHandler.updateGraphics(dt);
    this.communication.update(dt);
  }

  // Called when a new player joins.
  onPlayerJoin(idTag) {
    this.scoreManager.addPlayer(idTag);

    const name = this.instance.getPlayers()[idTag].name;
    this.currentGamemode.onPlayerJoin(idTag, name);
  }

  // Called when a player leaves the game.
  onPlayerLeave(idTag) {
    this.scoreManager.removePlayer(idTag);
    this.currentGamemode.onPlayerLeave(idTag);
  }
  // eslint-disable-next-line
  onSensorMoved(id, sensor) {}

  // eslint-disable-next-line
  onButtonPressed(id, button) {}
}

export default Game;

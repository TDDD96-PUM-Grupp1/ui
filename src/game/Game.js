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
    this.communication.setGameListener(this);

    // Create all handlers
    this.entityHandler = new EntityHandler();
    this.collisionHandler = new CollisionHandler(this.entityHandler);
    this.resourceServer = new ResourceServer();
    this.scoreManager = new ScoreManager(communication.getPlayers());

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
    this.currentGamemode.onPlayerJoin(idTag);
  }

  // Called when a player leaves the game.
  onPlayerLeave(idTag) {
    this.scoreManager.removePlayer(idTag);
    this.currentGamemode.onPlayerLeave(idTag);
  }
}

export default Game;

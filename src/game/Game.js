// import * as PIXI from 'pixi.js';
import EntityHandler from './EntityHandler';
import CollisionHandler from './CollisionHandler';
import ResourceServer from './ResourceServer';
import GamemodeHandler from './GamemodeHandler';
import ScoreManager from './ScoreManager';
import RespawnHandler from './RespawnHandler';

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

    // Resize listener
    this.notifyResizeListeners = this.notifyResizeListeners.bind(this);
    this.resizeListeners = [];
    this.registerResizeListener(this);
    window.onresize = this.notifyResizeListeners;

    // Create all handlers
    this.entityHandler = new EntityHandler();
    this.collisionHandler = new CollisionHandler(this.entityHandler);
    this.respawnHandler = new RespawnHandler(this.entityHandler);
    this.resourceServer = new ResourceServer();
    this.scoreManager = new ScoreManager();

    // Load in basic resources
    this.basicResources = {};
    this.resourceServer
      .requestResources([
        { name: 'circle', path: 'circle.png' },
        { name: 'circle_outline', path: 'circle_outline.png' },
      ])
      .then(resources => {
        this.basicResources = resources;
      });

    // Create gamemode, gameButtons not currently used but still set
    // to show that the functionality exists
    this.gamemodeLoaded = false;
    const gamemodeHandler = GamemodeHandler.getInstance();
    this.gameButtons = gamemodeHandler.getButtons();
    const { SelectedMode, requestedResources } = gamemodeHandler.getSelected();
    this.resourceServer.requestResources(requestedResources).then(resources => {
      this.currentGamemode = new SelectedMode(this, resources);
      this.currentGamemode.init();
      this.gamemodeLoaded = true;
    });
  }

  // Main game loop
  loop(delta) {
    // Convert frame delta to time delta [second] (assuming 60fps)
    const dt = delta / 60;

    // Update handlers and gamemodes
    if (this.gamemodeLoaded) {
      this.currentGamemode.preUpdate(dt);
      this.entityHandler.update(dt);
      this.collisionHandler.handleCollisions(dt);
      this.currentGamemode.postUpdate(dt);
      this.respawnHandler.checkRespawns();
      this.entityHandler.updateGraphics(dt);
    }
  }

  // Called when a new player joins.
  onPlayerJoin(playerObject) {
    this.currentGamemode.onPlayerJoin(playerObject).then(() => {
      this.scoreManager.addPlayer(playerObject);
    });
  }

  // Called when a player leaves the game.
  onPlayerLeave(idTag) {
    this.scoreManager.removePlayer(idTag);
    this.currentGamemode.onPlayerLeave(idTag);
  }
  // eslint-disable-next-line
  onSensorMoved(id, sensor) {}

  // eslint-disable-next-line
  onButtonsPressed(id, button) {
    this.currentGamemode.onButtonPressed(id, button);
  }

  // eslint-disable-next-line
  onButtonPressed(id, button) {}

  onPingUpdated(id, ping) {
    if (this.scoreManager.hasScoreType('Latency')) {
      this.scoreManager.setScore('Latency', id, `${ping} ms`);
    }
  }

  registerResizeListener(listener) {
    this.resizeListeners.push(listener);
  }

  notifyResizeListeners() {
    this.resizeListeners.forEach(listener => {
      listener.onWindowResize();
    });
  }

  onWindowResize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }
}

export default Game;

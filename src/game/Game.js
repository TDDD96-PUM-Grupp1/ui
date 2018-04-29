// import * as PIXI from 'pixi.js';
import EntityHandler from './EntityHandler';
import CollisionHandler from './CollisionHandler';
import ResourceServer from './ResourceServer';
import GamemodeHandler from './GamemodeHandler';
import ScoreManager from './ScoreManager';
import RespawnHandler from './RespawnHandler';

import settings from './../config';
import LocalPlayerController from './entities/controllers/LocalPlayerController';
import Instance from './Instance';

/*
Game.
*/
class Game {
  constructor(app, communication) {
    this.app = app;
    this.communication = communication;
    this.instance = this.communication.getInstance();

    // This will be undefined when running tests since we haven't
    // started an instance.
    if (this.instance !== undefined) {
      this.instance.addInstanceListener(this);
    } else {
      // Test instance
      this.instance = new Instance('Test', 8);
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

    this.gamemodeLoaded = false;

    // Load in basic resources
    this.basicResources = {};
    this.resourceServer
      .requestResources([
        { name: 'circle', path: 'circle.png' },
        { name: 'circle_outline', path: 'circle_outline_good.png' },
      ])
      .then(resources => {
        this.basicResources = resources;
        // Create gamemode

        const gamemodeHandler = GamemodeHandler.getInstance();
        const { SelectedMode, requestedResources } = gamemodeHandler.getSelected();
        this.resourceServer.requestResources(requestedResources).then(gamemodeResources => {
          this.currentGamemode = new SelectedMode(this, gamemodeResources);
          this.currentGamemode.init();
          this.gamemodeLoaded = true;

          if (settings.game.localPlayer) {
            this.addLocalPlayers();
          }
        });
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

  // Adds local players to the instance.
  addLocalPlayers() {
    const { instance } = this;
    instance.addPlayer({
      iconID: 1,
      id: 'local',
      name: 'local',
      backgroundColor: '#EE6666',
      iconColor: '#00ffff',
    });
    instance.addPlayer({
      iconID: 2,
      id: 'local2',
      name: 'local2',
      backgroundColor: '#EEFFF66',
      iconColor: '#4422ff',
    });
    setTimeout(() => {
      const localPlayer = this.currentGamemode.players.local;
      if (localPlayer) {
        // TODO: Make local player work through a normal player controller
        localPlayer.setController(new LocalPlayerController(this, 'local'));
      }
    }, 500);
    if (settings.game.testLeave) {
      setTimeout(() => {
        instance.sensorMoved('local2', { beta: 30, gamma: 0 });
      }, 3 * 1000);
    }
    if (settings.game.testLeave) {
      setTimeout(() => {
        instance.removePlayer('local2');
      }, 10 * 1000);
    }
    if (settings.game.testLeave) {
      setTimeout(() => {
        instance.addPlayer({
          iconID: 2,
          id: 'local2',
          name: 'local2',
          backgroundColor: '#EEFFF66',
          iconColor: '#4422ff',
        });
      }, 13 * 1000);
    }
    if (settings.game.testLeave) {
      setTimeout(() => {
        instance.sensorMoved('local2', { beta: 30, gamma: 0 });
      }, 16 * 1000);
    }
  }

  // Register an entity with the entityhandler
  register(entity) {
    this.app.stage.addChild(entity.graphic);
    this.entityHandler.register(entity);
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

import * as PIXI from 'pixi.js';
import EntityHandler from './EntityHandler';
import CollisionHandler from './CollisionHandler';
import ResourceServer from './ResourceServer';
import GamemodeHandler from './GamemodeHandler';
import ScoreManager from './ScoreManager';
import RespawnHandler from './RespawnHandler';
import InstanceNameGraphic from './InstanceNameGraphic';
import settings from './../config';
import Instance from './Instance';
import GamemodeConfigHandler from './GamemodeConfigHandler';
import KeyboardManager from './KeyboardManager';

// Graphics scaling
const BASE_HEIGHT = 1000;

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
      this.instance = new Instance('Test \ud83e\udd14', 50);
      this.instance.addInstanceListener(this);
    }

    // Resize listener
    this.notifyResizeListeners = this.notifyResizeListeners.bind(this);
    this.resizeListeners = [];
    this.registerResizeListener(this);
    window.onresize = this.notifyResizeListeners;
    this.gameStageWidth = BASE_HEIGHT;
    this.gameStageHeight = BASE_HEIGHT;

    // Create all handlers
    this.entityHandler = new EntityHandler();
    this.collisionHandler = new CollisionHandler(this.entityHandler);
    this.respawnHandler = new RespawnHandler(this.entityHandler);
    this.resourceServer = new ResourceServer();
    this.scoreManager = new ScoreManager();

    this.gameStage = new PIXI.Container();
    this.app.stage.addChild(this.gameStage);
    this.staticStage = new PIXI.Container();
    this.app.stage.addChild(this.staticStage);

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
        const { SelectedMode, requestedResources, options } = gamemodeHandler.getSelected();
        this.resourceServer.requestResources(requestedResources).then(gamemodeResources => {
          this.currentGamemode = new SelectedMode(this, gamemodeResources);
          this.currentGamemode.init();

          this.handler = new GamemodeConfigHandler(this, this.currentGamemode, options);

          this.gamemodeLoaded = true;
          this.notifyResizeListeners();

          if (settings.game.localPlayer) {
            this.addLocalPlayers();
          }
        });
      });

    // Add instance name
    this.nameGraphic = new InstanceNameGraphic(this);
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

  // Set up game buttons
  // eslint-disable-next-line
  setUpGameButtons(abilities) {
    abilities.forEach(ability => {
      // eslint-disable-next-line
      const { name } = ability;
      // TODO: This info has been sent to controller when game was launched
      // But we might want to update the buttons on the controller at some point.
    });
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
    for (let i = 1; i < settings.game.dummyCount; i += 1) {
      instance.addPlayer({
        iconID: i + 1,
        id: `local${i}`,
        name: `local${i}`,
        backgroundColor: '#EEFFF66',
        iconColor: `#${Math.floor(Math.random() * 0xffffff).toString(16)}`,
      });
    }
    this.localPlayerInputManager = new KeyboardManager(
      (beta, gamma) => {
        instance.sensorMoved('local', { beta, gamma });
      },
      button => {
        this.onButtonsPressed('local', button);
      }
    );
    this.localPlayerInputManager.bindEventListener();
    if (settings.game.testMove) {
      setTimeout(() => {
        instance.sensorMoved('local2', { beta: 30, gamma: 0 });
      }, 3 * 1000);
    }
    if (settings.game.testLeave) {
      setTimeout(() => {
        instance.removePlayer('local2');
      }, 10 * 1000);
    }
    if (settings.game.testRejoin) {
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
    if (settings.game.testMove) {
      setTimeout(() => {
        instance.sensorMoved('local2', { beta: 30, gamma: 0 });
      }, 16 * 1000);
    }
  }

  // Register an entity with the entityhandler
  register(entity) {
    this.gameStage.addChild(entity.graphic);
    this.entityHandler.register(entity);
  }

  // Register a wall entity with the entityhandler
  registerWall(entity) {
    this.gameStage.addChild(entity.graphic);
    this.entityHandler.registerWall(entity);
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
    let targetHeight = BASE_HEIGHT;
    if (this.currentGamemode && this.currentGamemode.scaleHeight) {
      targetHeight = this.currentGamemode.scaleHeight;
    }
    const scale = window.innerHeight / targetHeight;
    this.gameStageWidth = window.innerWidth / scale;
    this.gameStageHeight = targetHeight;
    const centerx = window.innerWidth / 2;
    const centery = window.innerHeight / 2;
    this.gameStage.scale.x = scale;
    this.gameStage.scale.y = scale;
    // Keep 0, 0 in gameStage in the center of the screen
    this.gameStage.x = centerx;
    this.gameStage.y = centery;

    if (settings.game.scaleUI) {
      this.staticStage.scale.x = scale;
      this.staticStage.scale.y = scale;
    }

    this.nameGraphic.reposition();
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }
}

export default Game;

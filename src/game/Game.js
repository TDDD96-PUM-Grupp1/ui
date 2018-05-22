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
import iconData from './iconData';

// Graphics scaling
const BASE_HEIGHT = 1000;

/*
Game.
*/
class Game {
  constructor(app, communication) {
    // Drop a global reference to the game so things can be tweaked from the in-browser console
    window.game = this;

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

    // Set up pixi containers
    this.gameStage = new PIXI.Container();
    this.app.stage.addChild(this.gameStage);
    this.staticStage = new PIXI.Container();
    this.app.stage.addChild(this.staticStage);

    // Track joined players so we don't crash if they leave before they have joined
    this.joinedPlayers = {};
    this.leavingPlayers = {};

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

        this.startGamemode().then(() => {
          // Let local players join after it has loaded
          if (settings.game.localPlayer) {
            this.addLocalPlayers();
          }
        });
      });

    // Add instance name
    this.nameGraphic = new InstanceNameGraphic(this);
  }

  startGamemode() {
    // Create gamemode
    const gamemodeHandler = GamemodeHandler.getInstance();
    const { SelectedMode, resources, options } = gamemodeHandler.getSelected();
    return new Promise(resolve => {
      this.resourceServer.requestResources(resources).then(loadedResources => {
        this.currentGamemode = new SelectedMode(this, loadedResources);
        this.currentGamemode.init();

        this.handler = new GamemodeConfigHandler(this, this.currentGamemode, options);

        this.gamemodeLoaded = true;
        this.notifyResizeListeners();
        resolve();
      });
    });
  }

  switchGamemode(nextGamemode) {
    this.gamemodeLoaded = false;
    const gamemodeHandler = GamemodeHandler.getInstance();
    gamemodeHandler.selectGameMode(nextGamemode);
    this.instance.stashPlayers();

    // Clean up entities and graphics
    this.entityHandler.clear();
    this.respawnHandler.clean();
    this.currentGamemode.cleanUp();
    this.handler.clean();

    this.startGamemode().then(() => {
      this.instance.popStash();
    });
  }

  // Main game loop
  loop(delta) {
    // Convert frame delta to time delta [second] (assuming 60fps)
    const dt = delta / 60;

    // Update handlers and gamemodes
    if (this.gamemodeLoaded) {
      this.handler.preUpdate(dt);
      this.currentGamemode.preUpdate(dt);
      this.entityHandler.update(dt);
      this.collisionHandler.handleCollisions(dt);
      this.handler.postUpdate(dt);
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
      iconID: 0,
      id: 'local',
      name: 'local',
      backgroundColor: '#EE6666',
      iconColor: '#00ffff',
    });
    for (let i = 1; i <= settings.game.dummyCount; i += 1) {
      instance.addPlayer({
        iconID: i % iconData.length,
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
        instance.sensorMoved('local1', { beta: 30, gamma: 0 });
      }, 3 * 1000);
    }
    if (settings.game.testLeave) {
      setTimeout(() => {
        instance.removePlayer('local1');
      }, 6 * 1000);
    }
    if (settings.game.testRejoin) {
      setTimeout(() => {
        instance.addPlayer({
          iconID: 1,
          id: 'local1',
          name: 'local1',
          backgroundColor: '#EEFFF66',
          iconColor: '#4422ff',
        });
      }, 13 * 1000);
    }
    if (settings.game.testMove) {
      setTimeout(() => {
        instance.sensorMoved('local1', { beta: 30, gamma: 0 });
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
    const { id } = playerObject;
    if (this.leavingPlayers[id]) {
      delete this.leavingPlayers[id];
      return;
    }
    this.handler.onPlayerJoin(playerObject);
  }

  // Called when a player leaves the game.
  onPlayerLeave(id) {
    if (this.joinedPlayers[id] === undefined) {
      this.leavingPlayers[id] = id;
      return;
    }
    delete this.joinedPlayers[id];

    this.handler.onPlayerLeave(id);
    this.currentGamemode.onPlayerLeave(id);
  }

  // eslint-disable-next-line
  onSensorMoved(id, sensor) {}

  // eslint-disable-next-line
  onButtonsPressed(id, button) {
    this.handler.onButtonPressed(id, button);
    this.currentGamemode.onButtonPressed(id, button);
  }

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
    this.currentGamemode.onWindowResize();
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

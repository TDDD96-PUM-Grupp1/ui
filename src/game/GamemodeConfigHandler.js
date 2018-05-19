import AbilitySystem from './configsystems/AbilitySystem';
import RespawnSystem from './configsystems/RespawnSystem';
import KillSystem from './configsystems/KillSystem';
import HighscoreSystem from './configsystems/HighscoreSystem';
import SpawnSystem from './configsystems/SpawnSystem';
import LeaveSystem from './configsystems/LeaveSystem';

/*
Handles a gamemode's config
*/
class GamemodeConfigHandler {
  constructor(game, gamemode, options) {
    this.game = game;
    this.binds = {};
    this.gamemode = gamemode;
    this.options = options;

    this.players = {};

    // Used to communicate between events
    this.hooks = {};

    this.systems = [];
    this.preUpdateSystems = [];
    this.postUpdateSystems = [];
    // Assumed to return a promise, so there can only be one
    this.onPlayerJoinSystem = null;
    this.onPlayerCreatedSystems = [];
    this.onPlayerLeaveSystems = [];
    this.onButtonPressedSystems = [];

    this.injectBinds();
    this.setUpOptions();
  }

  getPlayerEntity(id) {
    return this.players[id];
  }

  // Adds a hook
  addHook(hook) {
    if (this.hooks[hook]) {
      throw new Error(`Hook '${hook}' is already defined.`);
    }
    this.hooks[hook] = [];
  }

  // Activate a hook
  triggerHook(hook, params) {
    if (this.hooks[hook] === undefined) {
      throw new Error(`Hook '${hook}' is not defined.`);
    }
    this.hooks[hook].forEach(func => func(params));
  }

  // Attach to a hook, essentially adding a listener function
  hookUp(hook, func) {
    if (this.hooks[hook] === undefined) {
      throw new Error(`Hook '${hook}' is not defined.`);
    }
    this.hooks[hook].push(func);
  }

  // Add a config system to the handler
  addSystem(System) {
    const system = new System(this, this.options);
    this.systems.push(system);
    // During the setup the system is assumed to config itself according to the config
    // and return an object containing the events it will need to listen to.
    // It is also assumed that the System will add eventual hooks during this.
    const binds = system.setup(this);
    if (binds === undefined) {
      throw new Error(`${System.name}'s setup method did not return an object.`);
    }
    // Add the system as a listener to the requested events.
    if (binds.preUpdate) {
      this.preUpdateSystems.push(system);
    }
    if (binds.postUpdate) {
      this.postUpdateSystems.push(system);
    }
    if (binds.onPlayerJoin) {
      // There may only be one player join system since it should return a promise
      if (this.onPlayerJoinSystem !== null) {
        throw new Error('GamemodeConfigHandler loaded two spawn systems.');
      }
      this.onPlayerJoinSystem = system;
    }
    if (binds.onPlayerCreated) {
      this.onPlayerCreatedSystems.push(system);
    }
    if (binds.onPlayerLeave) {
      this.onPlayerLeaveSystems.push(system);
    }
    if (binds.onButtonPressed) {
      this.onButtonPressedSystems.push(system);
    }
  }

  // Adds relevant config systems
  setUpOptions() {
    // Quick check of the keys present in the gamemode's options.
    // Adding the respective system if necessary.
    // Further improvement might be to ask systems to say if they should be added
    if (this.options.abilities) {
      this.addSystem(AbilitySystem);
    }
    if (this.options.kill) {
      this.addSystem(KillSystem);
    }
    if (this.options.highscore) {
      this.addSystem(HighscoreSystem);
    }
    if (this.options.respawn) {
      this.addSystem(RespawnSystem);
    }
    // Background color hangs around here too
    if (this.options.backgroundColor !== undefined) {
      this.game.app.renderer.backgroundColor = this.options.backgroundColor;
    }

    this.addSystem(LeaveSystem);

    // Always add the spawn system because we only have games built around this one.
    // If in the future you'd want to "spawn" players as something other than a circle with an icon
    // then another spawn system should be added.
    this.addSystem(SpawnSystem);

    // After all systems have been added they should attach to hooks
    // There is no assumption about specific order this will happen in
    // so the available hooks should have already been created during setup.
    this.systems.forEach(system => system.attachHooks());
  }

  // Injects the handler into the gamemode events allowing us to seamlessly add functionality
  injectBinds() {
    this.injectBind('preUpdate');
    this.injectBind('postUpdate');
    this.injectBind('onPlayerJoin');
    this.injectBind('onPlayerCreated');
    this.injectBind('onPlayerLeave');
    this.injectBind('onButtonPressed');
  }

  // Swap a function in a gamemode with one of ours
  injectBind(func) {
    const temp = this.gamemode[func];

    this.gamemode[func] = this[func].bind(this);
    if (temp === undefined) {
      this.binds[func] = () => {};
    } else {
      this.binds[func] = temp.bind(this.gamemode);
    }
  }

  // Called before the physics update each loop
  preUpdate(dt) {
    this.preUpdateSystems.forEach(system => system.preUpdate(dt));
    this.binds.preUpdate(dt);
  }

  // Called after the physics update
  postUpdate(dt) {
    this.postUpdateSystems.forEach(system => system.postUpdate(dt));
    this.binds.postUpdate(dt);
  }

  // Called when a player joins the game
  // Should return a promise
  onPlayerJoin(playerObject) {
    return this.onPlayerJoinSystem.onPlayerJoin(playerObject);
  }

  // Called when a player joins the game but after they have had an entity created for them
  onPlayerCreated(playerObject, circle) {
    this.onPlayerCreatedSystems.forEach(system => system.onPlayerCreated(playerObject, circle));
    this.binds.onPlayerCreated(playerObject, circle);
  }

  // Called when a player leaves the game
  onPlayerLeave(id) {
    this.onPlayerLeaveSystems.forEach(system => system.onPlayerLeave(id));
    this.binds.onPlayerLeave(id);
  }

  // Called when a player pressed a button
  onButtonPressed(id, button) {
    this.onButtonPressedSystems.forEach(system => system.onButtonPressed(id, button));
    this.binds.onButtonPressed(id, button);
  }
}

export default GamemodeConfigHandler;

class Instance {
  constructor(name, maxPlayers) {
    this.name = name;
    this.maxPlayers = maxPlayers;
    this.players = {};
    this.instanceListener = undefined;

    this.addInstanceListener = this.addInstanceListener.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
    this.sensorMoved = this.sensorMoved.bind(this);
    this.buttonPressed = this.buttonPressed.bind(this);
    this.getName = this.getName.bind(this);
    this.getMaxPlayers = this.getMaxPlayers.bind(this);
    this.getPlayer = this.getPlayer.bind(this);
    this.getPlayers = this.getPlayers.bind(this);
  }

  /*
   * Set the instance listeners that listens for players joining, leaving,
   * moving the sensor or pressing buttons.
   * @param listener the listener that is called.
   */
  addInstanceListener(listener) {
    this.instanceListener = listener;
  }

  /*
   * Adds a player to the instance.
   * @param String id Id of the player.
   * @param String name Name of the player.
   * @return String with error if one has occured */
  addPlayer(playerObject) {
    const { id, name } = playerObject;
    if (Object.keys(this.players).length >= this.maxPlayers) {
      return 'Instance is full';
    }

    if (name.length > 21) {
      return 'Name is too long.';
    } else if (name.length === 0) {
      return 'No name specified';
    }

    if (playerObject.sensor === undefined) {
      playerObject.sensor = { beta: 0, gamma: 0 };
    }

    // Checks if the joining player already exists, and if they do whether they have reconnected
    // with new presets or not.
    const joiningPlayer = this.players[playerObject.id];
    if (joiningPlayer === undefined) {
      // Joining player does not already exist
      if (this.instanceListener !== undefined) {
        this.players[playerObject.id] = playerObject;
        this.instanceListener.onPlayerJoin(playerObject);
        // New player, add him
        return '';
      }
      // Player trying to connect to uninitialized game
      return 'Game is not running';
    } else if (
      joiningPlayer.name === playerObject.name &&
      joiningPlayer.iconID === playerObject.iconID &&
      joiningPlayer.iconColor === playerObject.iconColor &&
      joiningPlayer.backgroundColor === playerObject.backgroundColor
    ) {
      // Player connects with the same information
      return 'no comm add';
    }
    // New changes, kick and add player
    this.removePlayer(playerObject.id);
    this.players[id] = playerObject;
    this.instanceListener.onPlayerJoin(playerObject);
    return 'no comm add';
  }

  /*
   * Removes the player from the instance and notifies the game.
   * @param id The id of the player.
   */
  removePlayer(id) {
    if (this.instanceListener !== undefined) {
      this.instanceListener.onPlayerLeave(id);
    }
    delete this.players[id];
  }

  /*
   * Updates the sensor data of a player and notifies the game about it.
   * @param String id Id of the player.
   * @param {beta,gamma} sensor Object containing beta and gamma of the sensor.
   */
  sensorMoved(id, sensor) {
    this.players[id].sensor = sensor;
    if (this.instanceListener !== undefined) {
      this.instanceListener.onSensorMoved(id, sensor);
    }
  }

  /*
   * Notifies the game that a buttons has been pressed by a player.
   * @param String id Id of the player.
   * @param Int button Button number of the button
   */
  buttonPressed(id, button) {
    if (this.instanceListener !== undefined) {
      this.instanceListener.onButtonsPressed(id, button);
    }
  }

  pingUpdated(id, ping) {
    if (this.instanceListener !== undefined) {
      this.instanceListener.onPingUpdated(id, ping);
    }
  }

  /*
   * @return the name of the instance as a string
   */
  getName() {
    return this.name;
  }

  /*
   * @return the maximum number of players in the instance.
   */
  getMaxPlayers() {
    return this.maxPlayers;
  }

  /*
   * @param id The id of the wanted player.
   * @return the player with the given id.
   */
  getPlayer(id) {
    return this.players[id];
  }

  /*
   * @return all the players in the current instance.
   */
  getPlayers() {
    return this.players;
  }

  stashPlayers() {
    this.stash = {};
    Object.keys(this.players).forEach(key => {
      this.stash[key] = this.players[key];
    });
  }

  popStash() {
    this.players = {};
    Object.keys(this.stash).forEach(key => {
      this.addPlayer(this.stash[key]);
    });
  }
}

export default Instance;

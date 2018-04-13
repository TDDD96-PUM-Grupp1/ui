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
   * @return true if the player was added and false otherwise.
   */
  addPlayer(id, name) {
    if (Object.keys(this.players).length >= this.maxPlayers) {
      return false;
    }
    this.players[id] = { name, sensor: { beta: 0, gamma: 0 } };

    if (this.instanceListener !== undefined) {
      this.instanceListener.onPlayerJoin(id);
    }

    return true;
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
}

export default Instance;

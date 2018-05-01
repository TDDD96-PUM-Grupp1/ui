/* eslint-disable prettier/prettier */
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

    let joinState = 0;
    /* Check if the joining player:
      0 - Does not currently exist
      1 - Already exists
      2 - Already exists and connects with different presets,
      Set joinState to the correct state of the connection
       */
    const playerIDs = Object.keys(this.players);
    for (let i = 0; i < playerIDs.length; i += 1) {
      if (playerIDs[i] === playerObject.id) {
        const joiningPlayer = this.players[playerIDs[i]];
        if (
          joiningPlayer.name === playerObject.name &&
          joiningPlayer.iconID === playerObject.iconID &&
          joiningPlayer.iconColor === playerObject.iconColor &&
          joiningPlayer.backgroundColor === playerObject.backgroundColor
        ) {
          // Player already exists and does not want to change presets, do nothing
          joinState = 1;
          break;
        } else {
          // Existing player wants to change presets, boot
          // old character and add player as a new player
          joinState = 2;
          break;
        }
      }
    }

    if (joinState === 0) {
      console.log('State 0, Add');
      // Add
      this.players[id] = playerObject;
      if (this.instanceListener !== undefined) {
        this.instanceListener.onPlayerJoin(playerObject);
      }
      // No error has occured
      return '';
    } else if (joinState === 1) {
      console.log('State 1, Nothing');
      // Do nothing
      return '';
    } else if (joinState === 2) {
      console.log('State 2, Remove and add');
      // Kick and add
      this.players[id] = playerObject;
      if (this.instanceListener !== undefined) {
        this.instanceListener.onPlayerLeave(playerObject.id);
        this.instanceListener.onPlayerJoin(playerObject);
      }
      // No error has occured
      return '';
    }
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
}

export default Instance;

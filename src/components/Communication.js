import deepstream from 'deepstream.io-client-js';

class Communication {
  /*
  * Constructor for Communication.
  * Establishes connection with the Deepstream server. Awaits
  * a RPC from a client.
  */
  constructor(options, onConnected) {
    // Connect to deepstream
    this.instance = undefined; // this.client.getUid();
    this.players = {};

    this.connectDeepstream(options, onConnected);

    // Bind callbacks
    this.getPlayers = this.getPlayers.bind(this);
    this.connectDeepstream = this.connectDeepstream.bind(this);
    this.readSensorData = this.readSensorData.bind(this);
    this.presenceUpdate = this.presenceUpdate.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.createInstance = this.createInstance.bind(this);
  }

  connectDeepstream(options, onConnected) {
    this.client = deepstream(options.host_ip);
    // Topic and data isn't used but cannot be removed since it is a callback function.
    /* eslint-disable no-unused-vars */
    this.client.on('error', (err, event, topic) => {
      onConnected(false);
    });
    this.client.login(options.auth, (success, data) => {
      onConnected(success);
    });
    /* eslint-enable no-unused-vars */
  }

  /*
   Create the instance and provide an rpc for connecting players.
   */
  createInstance(_name, callback) {
    this.client.rpc.make('services/createInstance', { name: _name }, (err, data) => {
      if (!err && !data.error) {
        this.instance = _name;
        this.client.rpc.provide(`data/${this.instance}/addPlayer`, this.addPlayer);
      }
      callback(err, data);
    });
  }

  /*
  * Adds player to the list of players. Starts to listen to the events
  * published by that player.
  */
  addPlayer(data, response) {
    console.log(`Player ${data.id} has connected`);
    this.players[data.id] = { name: data.name, sensor: data.sensor };
    this.client.event.subscribe(`data/${this.instance}/${data.id}`, this.readSensorData);
    response.send(data.id);
    // this.client.presence.subscribe(data.id, this.presenceUpdate);

    if (this.gameListener != null) {
      this.gameListener.onPlayerJoin(data.id);
    }
  }

  /*
  * Callback for a presence update for a controller.If disconnected
  * removes player and unsubscribes from player channel.
  */
  presenceUpdate(username, login) {
    if (!login) {
      console.log(`Players ${username} has disconnected`);
      delete this.players[username];
      this.client.event.unsubscribe(`data/${this.instance}/${username}`);
      this.client.presence.unsubscribe(username);
    }
  }

  /*
  * Callback for reading sensordata. Updates a specific players sensorvalues.
  */
  readSensorData(data) {
    if (data.sensor) {
      this.players[data.id].sensor = data.sensor;
    }
  }

  // Get player info for an id.
  getPlayerInfo(id) {
    return this.players[id];
  }

  getPlayers() {
    return this.players;
  }

  // Add a gamelistener to listen for events.
  setGameListener(gameListener) {
    this.gameListener = gameListener;
  }
}

export default Communication;

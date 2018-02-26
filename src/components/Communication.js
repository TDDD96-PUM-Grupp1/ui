import createDeepstream from 'deepstream.io-client-js';

class Communication {
  /*
  * Constructor for Communication.
  * Establishes connection with the Deepstream server. Awaits
  * a RPC from a client.
  */
  constructor() {
    // Connect to deepstream
    this.ds = createDeepstream('10.90.128.65:60020');
    this.instance = 'abc'; // this.client.getUid();
    this.client = this.ds.login({ username: this.instance });
    this.players = {};
    this.addPlayer = this.addPlayer.bind(this);
    this.client.rpc.provide(`data/${this.instance}/addPlayer`, this.addPlayer);

    // Bind callbacks
    this.getPlayers = this.getPlayers.bind(this);
    this.readSensorData = this.readSensorData.bind(this);
    this.presenceUpdate = this.presenceUpdate.bind(this);

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

  getPlayers() {
    return this.players;
  }
}

export default Communication;

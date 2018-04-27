import deepstream from 'deepstream.io-client-js';
import Instance from './../game/Instance';

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
    this.timeoutCount = options.timeout_count;
    this.pingrate = options.pingrate;
    this.serviceName = options.service_name;
    this.id = undefined;

    // If we are testing things don't connect to deepstream.
    if (options.host_ip !== undefined) {
      this.connectDeepstream(options.host_ip, options.auth, onConnected);
    }

    // Bind callbacks
    this.connectDeepstream = this.connectDeepstream.bind(this);
    this.createInstance = this.createInstance.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.removePlayer = this.removePlayer.bind(this);
    this.readData = this.readData.bind(this);
    this.update = this.update.bind(this);
    this.getInstance = this.getInstance.bind(this);
    this.onPingTime = this.onPingTime.bind(this);
    this.setPingTime = this.setPingTime.bind(this);
  }

  /*
   * Connects to the deepstream socket.
   * @param ip The ip that will be connected to.
   * @param onConnected The callback that will be run when connected (or not).
   */
  connectDeepstream(ip, auth, onConnected) {
    this.client = deepstream(ip);
    // Topic and data isn't used but cannot be removed since it is a callback function.
    /* eslint-disable no-unused-vars */
    this.client.on('error', (err, event, topic) => {
      onConnected(false, event);
    });
    this.id = this.client.getUid();
    auth.username = this.id;
    this.client.login(auth, (success, data) => {
      onConnected(success, data);
    });
    /* eslint-enable no-unused-vars */
  }

  /*
   * Create the instance and provide an rpc for connecting players.
   * @param name the name of the instance that wants to be created.
   * @param callback the function that will be called when the service responds.
   */
  createInstance(gameInfo, callback) {
    gameInfo.id = this.id;
    // Ask the service if the UI can start an instance.
    this.client.rpc.make(`${this.serviceName}/createInstance`, gameInfo, (err, data) => {
      if (!err && !data.error) {

        this.setPingTime(this.update, );
        setInterval(this.update, 1000 / (1 * this.pingrate));
        // Instance can be created.
        this.instance = new Instance(gameInfo.name, gameInfo.maxPlayers, gameInfo.gamemode);

        // Provide an RPC that will let players join.
        this.client.rpc.provide(
          `${this.serviceName}/addPlayer/${this.instance.getName()}`,
          this.addPlayer
        );

        // Provide an RPC to let controllers test the ping to the UI.
        this.client.rpc.provide(
          `${this.serviceName}/pingTime/${this.instance.getName()}`,
          this.onPingTime
        );

        // Subsribe to the data channel of the players.
        // The sensor data and button data will be sent here.
        this.client.event.subscribe(
          `${this.serviceName}/data/${this.instance.getName()}`,
          this.readData
        );
      }
      callback(err, data);
    });
  }

  /*
  * This is an RPC that adds player to the list of players. Starts to listen to the events
  * published by that player.
  * @param data the data send from the controller. Should contain name, id,
  * backgroundColor, iconColor, iconID and sensor data.
  * @param response the response from the RPC
  */
  addPlayer(playerObject, response) {
    if (
      playerObject.id === undefined ||
      playerObject.backgroundColor === undefined ||
      playerObject.iconColor === undefined ||
      playerObject.iconID === undefined
    ) {
      response.error('Invalid data format');
      return;
    }

    // If false this usually means the instance is full.
    if (!this.instance.addPlayer(playerObject)) {
      response.error('cannot add player.');
      return;
    }

    // Initialize the communication players, keeping count of the timeout.
    this.players[playerObject.id] = { ping: this.timeoutCount };

    // Tell the service that another player has joined this instance.
    this.client.event.emit(`${this.serviceName}/playerAdded`, {
      instanceName: this.instance.getName(),
      playerName: playerObject.name,
    });

    response.send(playerObject.id);
  }

  /*
   * Remove a player from the list of players.
   * Notifies the service that a player has disconnected.
   * @param id the id of the player that has disconnected.
   */
  removePlayer(id) {
    if (this.players[id] === undefined) {
      return;
    }

    // Tell the service a player has disconnected.
    this.client.event.emit(`${this.serviceName}/playerRemoved`, {
      instanceName: this.instance.getName(),
      playerName: this.instance.getPlayer(id).name,
    });

    // Remove the communication player. Stop keeping track of timeouts
    delete this.players[id];
    // Remove the player from the instance.
    this.instance.removePlayer(id);
  }

  /*
  * Callback for reading sensordata. Updates a specific players sensorvalues.
  * @param data the data sent from a controller.
  */
  readData(data) {
    if (data === undefined || data.id === undefined) {
      return;
    }

    // Check if the player is in this instance.
    if (this.players[data.id] !== undefined) {
      // Reset the timout.
      this.players[data.id].ping = this.timeoutCount;
      if (data.sensor !== undefined) {
        // Update the sensor data.
        this.instance.sensorMoved(data.id, data.sensor);
      }

      for (let i = 0; i < data.bnum.length; i += 1) {
        // Update the button data.
        this.instance.buttonPressed(data.id, data.bnum[i]);
      }
    }
  }
  /*
   * This function will be called when a user pings this instance.
   */
  onPingTime(data, response) {
    if (this.instance !== undefined) {
      response.send({});
    } else {
      response.error('No instance started');
    }
  }

  /*
   * Updates the pingtimer and if enough time has passed it will ask the deepstream server
   * if all the players are still connected.
   */
  update() {
    // Instance is not yet created
    if (this.instance === undefined) {
      return;
    }

    // Increase the pingtimer.
    this.setPingTime();
    // Ping the service
    this.client.event.emit(`${this.serviceName}/instancePing`, { name: this.instance.getName() });

    const playerKeys = Object.keys(this.players);

    for (let i = 0; i < playerKeys.length; i += 1) {
      this.players[playerKeys[i]].ping -= 1;
      // Check if the player has timed out.
      if (this.players[playerKeys[i]].ping === 0) {
        this.removePlayer(playerKeys[i]);
      }
    }
  }

  /*
   * This function will return the started instance.
   * @return Instance The current instance of the game.
   */
  getInstance() {
    return this.instance;
  }

  /**
   * Sets the ping time correctly
   */
  setPingTime() {
    this.pingTime = Date.now() + 1000 * (1 / this.pingrate);
  }
}

export default Communication;

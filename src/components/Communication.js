import deepstream from 'deepstream.io-client-js';
import getClient from 'extended-ds-client';

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
    this.pingtimer = 0;
    this.pingrate = options.pingrate;
    this.serviceName = options.service_name;
    this.id = undefined;
    // If we are testing things don't connect to deepstream.
    if (options.host_ip !== undefined) {
      this.connectDeepstream(options.host_ip, options.auth, onConnected);
    }

    // Bind callbacks
    this.getPlayers = this.getPlayers.bind(this);
    this.connectDeepstream = this.connectDeepstream.bind(this);
    this.readData = this.readData.bind(this);
    this.addPlayer = this.addPlayer.bind(this);
    this.createInstance = this.createInstance.bind(this);
    this.update = this.update.bind(this);
  }
  /*
   * Connects to the deepstream socket.
   * @param ip The ip that will be connected to.
   * @param onConnected The callback that will be run when connected (or not).
   */
  connectDeepstream(ip, auth, onConnected) {
    this.client = getClient(ip);
    // Topic and data isn't used but cannot be removed since it is a callback function.
    /* eslint-disable no-unused-vars */
    this.client.on('error', (err, event, topic) => {
      onConnected(false, event);
    });
    this.id = this.client.getUid();
    auth.username = this.id;

    this.client.p
      .login(auth)
      .then((success, data) => {
        onConnected(success, data);
      })
      .catch(data => {
        console.log('Login failed', data);
      });

    /* eslint-enable no-unused-vars */
  }

  /*
   * Create the instance and provide an rpc for connecting players.
   * @param name the name of the instance that wants to be created.
   * @param callback the function that will be called when the service responds.
   */
  createInstance(name, callback) {
    const rpcCall = `${this.serviceName}/createInstance`;
    const rpcData = { id: this.id, name };

    this.client.rpc.p.make(rpcCall, rpcData).then((err, data) => {
      if (!err && !data.error) {
        this.instance = name;
        this.client.rpc.provide(`${this.serviceName}/addPlayer/${this.instance}`, this.addPlayer);
        this.client.event.subscribe(`${this.serviceName}/data/${this.instance}`, this.readData);
      }
      callback(err, data);
    });
  }

  /*
  * This is an RPC that adds player to the list of players. Starts to listen to the events
  * published by that player.
  * @param data the data send from the controller. Should contain name, id and sensor data.
  * @param response the response from the RPC
  */
  addPlayer(data, response) {
    this.players[data.id] = { name: data.name, sensor: data.sensor };
    this.client.event.emit(`${this.serviceName}/playerAdded`, {
      instanceName: this.instance,
      playerName: data.name,
    });
    response.send(data.id);

    if (this.gameListener != null) {
      this.gameListener.onPlayerJoin(data.id);
    }
  }

  /*
   * Remove a player from the list of players.
   * Notifies the service that a player has disconnected.
   * @param id the id of the player that has disconnected.
   */
  removePlayer(id) {
    this.client.event.emit(`${this.serviceName}/playerRemoved`, {
      instanceName: this.instance,
      playerName: this.players[id].name,
    });

    if (this.gameListener != null) {
      this.gameListener.onPlayerLeave(id);
    }

    delete this.players[id];
  }

  /*
  * Callback for reading sensordata. Updates a specific players sensorvalues.
  * @param data the data sent from a controller.
  */
  readData(data) {
    if (this.players[data.id] !== undefined) {
      if (data.sensor !== undefined) {
        this.players[data.id].sensor = data.sensor;
      }
    }

    for (let i = 0; i < data.bnum.length; i += 1) {
      this.buttonPressed(data.bnum[i]);
    }
  }

  /*
   * Updates the pingtimer and if enough time has passed it will ask the deepstream server
   * if all the players are still connected.
   * @param timeElapsed time elapsed since the last update, in seconds
   */
  // eslint-disable-next-line
  update(timeElapsed) {
    // TODO: Need to update the ping system.
    /*
    this.pingtimer += timeElapsed;
    if (this.pingtimer >= 1 / this.pingrate) {
      // No need to decrease the timer by 1/pingrate since the precision
      // is not necessary
      this.pingtimer = 0;
      this.client.presence.getAll(Object.keys(this.players), users => {
        const userKeys = Object.keys(users);
        for (let i = 0; i < userKeys.length; i += 1) {
          if (users[userKeys[i]] === false) {
            this.removePlayer(userKeys[i]);
          }
        }
      });
    }
    */
  }

  /** This function is called whenever a player presses a button on the controller.
   * The number of the button is used to identify which button was pressed, note that
   * button enumeration begins at 0.
   * @param data is an object such that {id: playerid, bNum: buttonNumber}
   */
  buttonPressed(data) {
    // TODO make this function change the game state in some way
    console.log('Button press received: ');
    console.log(data);
  }

  /*
   * Get player info from an id.
   * @param id the id of the player that is wanted.
   */
  getPlayerInfo(id) {
    return this.players[id];
  }

  /*
   * Get all the connected players
   */
  getPlayers() {
    return this.players;
  }

  /*
   * Add a game listener to listen for events.
   * @param gameListener the listener that will get called.
   */
  setGameListener(gameListener) {
    this.gameListener = gameListener;
  }
}

export default Communication;

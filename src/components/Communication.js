import createDeepstream from 'deepstream.io-client-js';
import React, { Component } from 'react';

class Communication extends Component {
  constructor(props) {
    super(props);
    // Connect to deepstream
    this.client = createDeepstream('10.90.128.65:60020').login();
    // Login
    this.counter = 0;
    this.instance = this.client.getUid();
    this.players = {};
    this.addPlayer = this.addPlayer.bind(this);
    this.readSensorData = this.readSensorData.bind(this);

    this.client.rpc.provide(`data/${this.instance}/addPlayer`, this.addPlayer);

    this.state = {
      beta: 0,
      gamma: 0,
    };
  }

  addPlayer(data, response) {
    this.players[data.id] = { name: data.name, sensor: data.sensor };
    this.client.event.subscribe(`data/${this.instance}/${this.data.id}`, this.readSensorData);
    response.send(data.id);
  }

  readSensorData(data) {
    console.log('asd');
    this.setState({
      beta: data.beta,
      gamma: data.gamma,
    });
  }

  render() {
    return (
      <div>
        <div>Beta: {Math.round(this.state.beta)}</div>
        <div>Gamma: {Math.round(this.state.gamma)}</div>
      </div>
    );
  }
}

export default Communication;

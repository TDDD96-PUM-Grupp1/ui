import createDeepstream from 'deepstream.io-client-js';
import React, { Component } from 'react';

class Communication extends Component {
  constructor(props) {
    super(props);
    // Connect to deepstream
    this.client = createDeepstream('10.90.128.65:60020').login();
    // Login
    this.counter = 0;
    this.instance = 'abc';
    this.addPlayer = this.addPlayer.bind(this);
    this.readSensorData = this.readSensorData.bind(this);

    this.client.rpc.provide(`data/${this.instance}/addPlayer`, this.addPlayer);
    this.heartbeatCounter = 0;
    this.client.event.subscribe(`data/${this.instance}/${this.counter}`, this.readSensorData);

    this.state = {
      beta: 0,
      gamma: 0
    };
  }

  addPlayer(data, response) {
    this.counter += 1;
    this.client.event.subscribe(`data/${this.instance}/${this.counter}`, this.readSensorData);
    response.send(this.counter);
  }

  readSensorData(data) {
    console.log('asd');
    this.setState({
      beta: data.beta,
      gamma: data.gamma
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

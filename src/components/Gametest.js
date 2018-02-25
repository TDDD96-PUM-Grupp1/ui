import React, { Component } from 'react';

import PIXI from 'pixi.js';

/*
Menu in UI with interchangeable content.
*/
class Gametest extends Component {
  constructor(props) {
    super(props);

    this.renderer = new PIXI.Application({ width: 256, height: 256 });
  }

  render() {
    return <div className="game">{this.renderer.view}</div>;
  }
}

export default Gametest;

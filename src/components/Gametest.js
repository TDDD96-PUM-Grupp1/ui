import React, { Component } from 'react';

import * as PIXI from 'pixi.js';

/*
Menu in UI with interchangeable content.
*/
class Gametest extends Component {
  constructor(props) {
    super(props);

    this.setRef = this.setRef.bind(this);
  }

  componentDidMount() {
    // Setup PIXI Canvas in componentDidMount
    this.renderer = PIXI.autoDetectRenderer(1366, 768);
    this.refElement.appendChild(this.renderer.view);

    // create the root of the scene graph
    this.stage = new PIXI.Container();
    this.stage.width = 1366;
    this.stage.height = 768;
  }

  setRef(c) {
    this.refElement = c;
  }

  render() {
    return <div className="game-canvas-container" ref={this.setRef} />;
  }
}

export default Gametest;

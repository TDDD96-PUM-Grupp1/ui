import React, { Component } from 'react';

import * as PIXI from 'pixi.js';

import Game from './game/Game';

/*
Game testing component.
*/
class Gametest extends Component {
  constructor(props) {
    super(props);

    this.setRef = this.setRef.bind(this);
  }

  componentDidMount() {
    // Setup PIXI Canvas in componentDidMount
    const app = new PIXI.Application();
    this.app = app;
    this.refElement.appendChild(this.app.renderer.view);

    // Make the canvas resolution scale to fit the window size
    app.renderer.view.style.position = 'absolute';
    app.renderer.view.style.display = 'block';
    app.renderer.autoResize = true;
    app.renderer.resize(window.innerWidth, window.innerHeight);

    // set background color
    app.renderer.backgroundColor = 0x061639;

    // Initialize game
    const game = new Game(app);

    app.ticker.add(delta => game.loop(delta));
  }

  setRef(c) {
    this.refElement = c;
  }

  render() {
    return <div className="game-canvas-container" ref={this.setRef} />;
  }
}

export default Gametest;

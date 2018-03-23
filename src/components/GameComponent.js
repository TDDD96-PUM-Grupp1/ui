import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as PIXI from 'pixi.js';

import Game from './game/Game';
/*
Game testing component.
*/
class GameComponent extends Component {
  constructor(props) {
    super(props);

    this.communication = this.props.communication;
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
    const game = new Game(app, this.communication);

    // Hook up the PIXI update loop with the game loop.
    app.ticker.add(delta => game.loop(delta));
  }

  setRef(c) {
    this.refElement = c;
  }

  render() {
    return <div className="game-canvas-container" ref={this.setRef} />;
  }
}

GameComponent.propTypes = {
  /* eslint-disable */
  communication: PropTypes.object.isRequired,
  /* eslint-enable */
};

export default GameComponent;

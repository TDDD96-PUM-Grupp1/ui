import React from 'react';
import ReactDOM from 'react-dom';
import assert from 'assert';
import * as PIXI from 'pixi.js';

import settings from './config';
import Communication from './components/Communication';
import App from './App';
import GamemodeHandler from './game/GamemodeHandler';
import Game from './game/Game';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('GamemodeHandler', () => {
  it('is a working singleton', () => {
    const inst1 = GamemodeHandler.getInstance();
    const inst2 = GamemodeHandler.getInstance();

    assert.equal(inst1, inst2);
  });

  it('selects all gamemodes', () => {
    const gmHandler = GamemodeHandler.getInstance();
    const gmList = gmHandler.getGamemodes();

    for (let i = 0; i < gmList.length; i += 1) {
      gmHandler.selectGameMode(gmList[i]);

      // Check so selection is done
      gmHandler.getSelected();
    }
  });

  it('loads all gamemodes', () => {
    const gmHandler = GamemodeHandler.getInstance();
    const gmList = gmHandler.getGamemodes();
    let GamemodeClass;
    // eslint-disable-next-line no-unused-vars
    let gamemode;

    // Extra components to allow for loading gamemodes
    const pixi = new PIXI.Application();
    const com = new Communication(settings.communication, () => {});
    const game = new Game(pixi, com);

    for (let i = 0; i < gmList.length; i += 1) {
      gmHandler.selectGameMode(gmList[i]);

      GamemodeClass = gmHandler.getSelected();
      gamemode = new GamemodeClass(game);
    }
  });
});

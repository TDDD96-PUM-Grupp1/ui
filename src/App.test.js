import React from 'react';
import ReactDOM from 'react-dom';
import * as PIXI from 'pixi.js';

import settings from './config';
import Communication from './components/Communication';

import App from './App';
import ResourceServer from './game/ResourceServer';
import GamemodeHandler from './game/GamemodeHandler';
import Game from './game/Game';
import ScoreManager from './game/ScoreManager';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App test />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('ResourceServer', () => {
  it('has correct error on missing resource', async () => {
    const filenames = [];

    const errorName = 'hejsan';
    const errorFilepath = 'NO_EXIST.txt';

    filenames.push({
      name: errorName,
      path: errorFilepath,
    });

    expect.assertions(1);
    const rs = new ResourceServer();
    /* eslint-disable function-paren-newline */
    await expect(rs.requestResources(filenames)).rejects.toEqual(
      new Error(`Failed to load resource ${errorName} from path resources/${errorFilepath}`),
    );
    /* eslint-enable function-paren-newline */
  });
});

describe('GamemodeHandler', () => {
  it('is a working singleton', () => {
    const inst1 = GamemodeHandler.getInstance();
    const inst2 = GamemodeHandler.getInstance();

    expect(inst1).toBe(inst2);
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

describe('ScoreManager', () => {
  // Mockupp netwrok data
  const comList = {
    id1: { name: 'player1' },
    id2: { name: 'player2' },
    id3: { name: 'player3' },
    id4: { name: 'player4' },
    id5: { name: 'player5' },
    id6: { name: 'player6' },
  };

  it('can add score', () => {
    let sm = new ScoreManager(comList);
    sm.addScoreType('score', 0, true);
    sm.setAscOrder(false);

    sm.addPlayer('id1');
    sm.addPlayer('id2');


    sm.addScore('score', 'id1', 2);
    sm.addScore('score', 'id2', 1);
    sm.addScore('score', 'id2', 2);

    const list = sm.getList();
    expect(list[0].name).toBe('player2');
    expect(list[1].name).toBe('player1');
    expect(list[0].score).toBe(3);
    expect(list[1].score).toBe(2);
  });

  it('can remove score', () => {
    let sm = new ScoreManager(comList);
    sm.addScoreType('score', 10, true);
    sm.setAscOrder(true);

    sm.addPlayer('id1');
    sm.addPlayer('id2');
    sm.addPlayer('id3');


    sm.removeScore('score', 'id1', 2);
    sm.removeScore('score', 'id2', 4);
    sm.removeScore('score', 'id3', 6);

    const list = sm.getList();
    expect(list[0].name).toBe('player3');
    expect(list[1].name).toBe('player2');
    expect(list[2].name).toBe('player1');
    expect(list[0].score).toBe(4);
    expect(list[1].score).toBe(6);
    expect(list[2].score).toBe(8);
  });

  it('can reset score', () => {
    let sm = new ScoreManager(comList);
    sm.addScoreType('score', 0, true);
    sm.setAscOrder(true);

    sm.addPlayer('id1');
    sm.addPlayer('id2');

    sm.addScore('score', 'id1', 3);
    sm.addScore('score', 'id2', 3);

    sm.resetScore('score');

    const list = sm.getList();
    expect(list[0].score).toBe(0);
    expect(list[1].score).toBe(0);
  });
});

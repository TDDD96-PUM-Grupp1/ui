import React from 'react';
import ReactDOM from 'react-dom';
import * as PIXI from 'pixi.js';
import renderer from 'react-test-renderer';

import settings from './config';
import Communication from './components/Communication';

import App from './App';
import ResourceServer from './game/ResourceServer';
import GamemodeHandler from './game/GamemodeHandler';
import Game from './game/Game';
import ScoreManager from './game/ScoreManager';
import FirstMenu from './components/FirstMenu';
import Instance from './game/Instance';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App test />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('ResourceServer', () => {
  it('has correct error on missing resource', async () => {
    const filenames = [];

    const errorName = 'hejsan';
    const errorFilepath = '/NO_EXIST.txt';

    filenames.push({
      name: errorName,
      path: errorFilepath,
    });

    expect.assertions(1);
    const rs = new ResourceServer();
    /* eslint-disable function-paren-newline */
    await expect(rs.requestResources(filenames)).rejects.toEqual(
      new Error(`Failed to load resource ${errorName} from path resources${errorFilepath}`)
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
    // eslint-disable-next-line no-unused-vars
    let gamemode;

    // Extra components to allow for loading gamemodes
    const pixi = new PIXI.Application();
    const com = new Communication(settings.communication, () => {});
    const game = new Game(pixi, com);

    for (let i = 0; i < gmList.length; i += 1) {
      gmHandler.selectGameMode(gmList[i]);

      const { SelectedMode, resources } = gmHandler.getSelected();
      // If this tests breaks in the future
      // the problem is probably that the resources aren't loaded
      gamemode = new SelectedMode(game, resources);
    }
  });

  it('makes sure all gamemodes overrides onWindowResize', () => {
    const gmHandler = GamemodeHandler.getInstance();
    const gmList = gmHandler.getGamemodes();
    // eslint-disable-next-line no-unused-vars
    let gamemode;

    // Extra components to allow for loading gamemodes
    const pixi = new PIXI.Application();
    const com = new Communication(settings.communication, () => {});
    const game = new Game(pixi, com);

    for (let i = 0; i < gmList.length; i += 1) {
      gmHandler.selectGameMode(gmList[i]);

      const { SelectedMode, resources } = gmHandler.getSelected();
      // If this tests breaks in the future
      // the problem is probably that the resources aren't loaded
      gamemode = new SelectedMode(game, resources);
      gamemode.onWindowResize();
    }
  });
});

describe('ScoreManager', () => {
  it('can add score', () => {
    const sm = new ScoreManager();
    sm.addScoreType('score', 0, true);
    sm.setAscOrder(false);

    sm.addPlayer({ id: 'id1', name: 'player1' });
    sm.addPlayer({ id: 'id2', name: 'player2' });

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
    const sm = new ScoreManager();
    sm.addScoreType('score', 10, true);
    sm.setAscOrder(true);

    sm.addPlayer({ id: 'id1', name: 'player1' });
    sm.addPlayer({ id: 'id2', name: 'player2' });
    sm.addPlayer({ id: 'id3', name: 'player3' });

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
    const sm = new ScoreManager();
    sm.addScoreType('score', 0, true);
    sm.setAscOrder(true);

    sm.addPlayer({ id: 'id1', name: 'player1' });
    sm.addPlayer({ id: 'id2', name: 'player2' });

    sm.addScore('score', 'id1', 3);
    sm.addScore('score', 'id2', 3);

    sm.resetScore('score');

    const list = sm.getList();
    expect(list[0].score).toBe(0);
    expect(list[1].score).toBe(0);
  });

  it('can set score', () => {
    const sm = new ScoreManager();
    sm.addScoreType('score', 0, true);
    sm.setAscOrder(false);

    sm.addPlayer({ id: 'id1', name: 'player1' });
    sm.addPlayer({ id: 'id2', name: 'player2' });
    sm.addPlayer({ id: 'id3', name: 'player3' });

    sm.setScore('score', 'id1', 3);
    sm.setScore('score', 'id2', 8);
    sm.setScore('score', 'id3', 5);

    const list = sm.getList();
    expect(list[0].name).toBe('player2');
    expect(list[1].name).toBe('player3');
    expect(list[2].name).toBe('player1');
    expect(list[0].score).toBe(8);
    expect(list[1].score).toBe(5);
    expect(list[2].score).toBe(3);
  });

  it('can use multiple score types', () => {
    const sm = new ScoreManager();
    sm.setAscOrder(false);

    sm.addScoreType('score1', 0);
    sm.addScoreType('score2', 0, true);

    sm.addPlayer({ id: 'id1', name: 'player1' });
    sm.addPlayer({ id: 'id2', name: 'player2' });

    sm.addScore('score1', 'id1', 2);
    sm.addScore('score1', 'id2', 1);

    sm.addScore('score2', 'id1', 4);
    sm.addScore('score2', 'id2', 7);

    const list = sm.getList();
    expect(list[0].name).toBe('player2');
    expect(list[1].name).toBe('player1');
    expect(list[0].score1).toBe(1);
    expect(list[1].score1).toBe(2);
    expect(list[0].score2).toBe(7);
    expect(list[1].score2).toBe(4);
  });
});

describe('FirstMenu', () => {
  it('matches the snapshot', () => {
    const showAbout = jest.fn();
    const showCreate = jest.fn();
    const tree = renderer
      .create(<FirstMenu showCreate={showCreate} showAbout={showAbout} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('Instance', () => {
  it('accepts players', () => {
    const inst = new Instance('TestInstance', 10);
    // Lint disable since the mockGame must use the same function-names as
    // the real class Game, which goes against Lint
    /* eslint-disable-next-line  */
    const mockGame = { onPlayerJoin: function() {} };
    inst.instanceListener = mockGame;
    const testPlayer = {
      id: 'test_id',
      name: 'test_player',
    };

    expect(inst.addPlayer(testPlayer)).toBe('');
  });

  it('checks max players', () => {
    const inst = new Instance('TestInstance', 1);
    // Lint disable since the mockGame must use the same function-names as
    // the real class Game, which goes against Lint
    /* eslint-disable-next-line  */
    const mockGame = { onPlayerJoin: function() {} };
    inst.instanceListener = mockGame;
    const testPlayer1 = {
      id: 'test_id1',
      name: 'test_player1',
    };

    const testPlayer2 = {
      id: 'test_id2',
      name: 'test_player2',
    };

    expect(inst.addPlayer(testPlayer1)).toBe('');
    expect(inst.addPlayer(testPlayer2)).toBe('Instance is full');
  });

  it('denies players with too short name', () => {
    const inst = new Instance('TestInstance', 10);
    const testPlayer = {
      id: 'test_id',
      name: '',
    };

    expect(inst.addPlayer(testPlayer)).toBe('No name specified');
  });

  it('denies players with too long name', () => {
    const inst = new Instance('TestInstance', 10);
    const testPlayer = {
      id: 'test_id',
      name: 'a_really_really_really_really_really_long_name',
    };

    expect(inst.addPlayer(testPlayer)).toBe('Name is too long.');
  });
});

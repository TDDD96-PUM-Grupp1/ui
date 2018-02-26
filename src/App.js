import React from 'react';
import './css/App.css';
import StartMenu from './components/StartMenu';
import Communication from './components/Communication';
import PlayerList from './components/PlayerList';

function getDummyName() {
  return {
    'cool-id': {
      name: 'my-name',
      sensor: {
        beta: 5,
        gamma: 7,
      },
    },
  };
}

const com = new Communication();

const App = () => (
  <div className="App">
    <StartMenu />
    <PlayerList getPlayersFunction={getDummyName} />
  </div>
);

export default App;

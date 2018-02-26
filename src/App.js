import React from 'react';
import './css/App.css';
import Communication from './components/Communication';
import PlayerList from './components/PlayerList';
import StartMenu from './components/StartMenu';
import settings from './config';

const com = new Communication(settings.communication);

const App = () => (
  <div className="App">
    <StartMenu />
    <PlayerList getPlayersFunction={com.getPlayers} />
  </div>
);

export default App;

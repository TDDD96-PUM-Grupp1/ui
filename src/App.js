import React from 'react';
import logo from './logo.svg';
import './App.css';
import Communication from './components/Communication';
import PlayerList from './components/PlayerList';
import StartMenu from './components/StartMenu';

const com = new Communication();

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="App-title">Welcome to React</h1>
    </header>
    <p className="App-intro">
      To get started, edit <code>src/App.js</code> and save to reload.
    </p>
    <StartMenu />
    <PlayerList getPlayersFunction={com.getPlayers} />

  </div>
);

export default App;

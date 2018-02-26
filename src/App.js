import React from 'react';
import './css/App.css';

// import StartMenu from './components/StartMenu';
import Gametest from './components/Gametest';
import Communication from './components/Communication';
import PlayerList from './components/PlayerList';
import StartMenu from './components/StartMenu';

const com = new Communication();

const App = () => (
  <div className="App">
    <Gametest />
  </div>
);

export default App;

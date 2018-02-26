import React from 'react';
import './css/App.css';
import StartMenu from './components/StartMenu';
import Communication from './components/Communication';

const com = new Communication();

const App = () => (
  <div className="App">
    <StartMenu />
  </div>
);

export default App;

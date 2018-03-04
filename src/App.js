import React from 'react';
import './css/App.css';

import Gametest from './components/Gametest';

// TODO: Uncomment and use the components below:
// import Communication from './components/Communication';
// import PlayerList from './components/PlayerList';
// import StartMenu from './components/StartMenu';
// import settings from './config';

// const com = new Communication(settings.communication);

const App = () => (
  <div className="App">
    <Gametest />
  </div>
);

export default App;

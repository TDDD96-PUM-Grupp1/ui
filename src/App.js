import React, { Component } from 'react';
import './css/App.css';

import Gametest from './components/Gametest';

// TODO: Uncomment and use the components below:
// import Communication from './components/Communication';
// import PlayerList from './components/PlayerList';
import StartMenu from './components/StartMenu';
// import settings from './config';

// const com = new Communication(settings.communication);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameActive: false,
    };

    this.setGameActive = this.setGameActive.bind(this);
  }

  setGameActive() {
    this.setState({
      gameActive: true,
    });
  }

  render() {
    return (
      <div className="App">
        {this.state.gameActive ? <Gametest /> : <StartMenu onGameStart={this.setGameActive} />}
      </div>
    );
  }
}

export default App;

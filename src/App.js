import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './css/App.css';

import GameComponent from './components/GameComponent';

// TODO: Uncomment and use the components below:
// import PlayerList from './components/PlayerList';
import Communication from './components/Communication';
import InstanceNameHandler from './components/InstanceNameHandler';
import StartMenu from './components/StartMenu';
import settings from './config';

function onConnect(success) {
  if (success) {
    console.log('Deepstream instanciated.');
  } else {
    // TODO: Maybe some form of indication to the user that the deepstream server is down.
    console.log("Couldn't instanciate deepstream connection.");
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameActive: false,
    };

    this.setGameActive = this.setGameActive.bind(this);

    this.instanceNameHandler = new InstanceNameHandler();

    // This is needed because of a weird TravisCI bug that caused the test
    // to get stuck when connecting.
    if (!props.test) {
      this.com = new Communication(settings.communication, onConnect);
    } else {
      // Provide no ip to force a failed connection
      this.com = new Communication('', onConnect);
    }
  }

  setGameActive() {
    this.setState({
      gameActive: true,
    });
  }

  render() {
    return (
      <div className="App">
        {this.state.gameActive ? (
          <GameComponent communication={this.com} />
        ) : (
          <StartMenu
            onGameStart={this.setGameActive}
            getRandomInstanceName={this.instanceNameHandler.getRandomInstanceName}
            onCreateInstance={this.com.createInstance}
            onGetRandomName={this.com.getRandomName}
            getPlayers={this.com.getPlayers}
          />
        )}
      </div>
    );
  }
}

App.defaultProps = {
  test: false,
};

App.propTypes = {
  test: PropTypes.bool,
};

export default App;

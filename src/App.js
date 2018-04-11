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

function onConnect(success, data) {
  if (!success) {
    // TODO: Maybe some form of indication to the user that the deepstream server is down.
    // eslint-disable-next-line
    console.log(data);
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
    if (props.test) {
      settings.communication.host_ip = undefined;
    } else if (process.env.REACT_APP_LOCAL) {
      // Use local deepstream server instead of Cybercom's
      // Log it to console to make sure the dev is aware ;)
      /* eslint-disable-next-line */
      console.log('Using local Deepstream host');
      settings.communication.host_ip = 'localhost:60020';
    }
    this.com = new Communication(settings.communication, onConnect);
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

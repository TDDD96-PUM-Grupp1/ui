import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paper, Button } from 'react-md';

import CreateMenu from './CreateMenu';
import FirstMenu from './FirstMenu';

/*
Menu in UI with interchangeable content.
*/
class StartMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: 'first',
    };

    this.showCreate = this.showCreate.bind(this);
    this.showAbout = this.showAbout.bind(this);
    this.showFirst = this.showFirst.bind(this);
  }

  /*
  Show the menu for creating games.
  */
  showCreate() {
    this.setState({ menu: 'create' });
  }

  /*
  Show the about page.
  */
  showAbout() {
    this.setState({ menu: 'about' });
  }

  /*
  Show the initial menu.
  */
  showFirst() {
    this.setState({ menu: 'first' });
  }

  render() {
    const menus = {
      first: (
        <Paper className="menu-button-holder">
          <FirstMenu showCreate={this.showCreate} showAbout={this.showAbout} />
        </Paper>
      ),

      create: (
        <CreateMenu
          onStart={this.props.onGameStart}
          onBack={this.showFirst}
          communication={this.props.communication}
        />
      ),
      about: (
        <Paper className="menu-button-holder">
          <div className="aboutHeader">About </div>
          <div className="aboutText">
            <p>
              This is a realtime multiplayer game that uses one screen and many controllers. An
              instance of the game is created from this application. The players can then join from
              the control-application on their phones. The game is controlled by players tilting
              their phone. There are a number of different gamemodes with different goals. Have fun!
            </p>
            <p>
              This game is the result of a project carried out by students from Linköping University
              for Cybercom Group. The game is open-source under the MIT-license. The source code can
              be found on <a href="https://github.com/TDDD96-PUM-Grupp1">GitHub</a>.
            </p>
          </div>
          <Button raised primary onClick={this.showFirst} className="menu-button">
            Back
          </Button>
        </Paper>
      ),
    };

    return (
      <div>
        <div className="game-title">IoT Party</div>
        <div className="menu-holder">{menus[this.state.menu]}</div>
      </div>
    );
  }
}

StartMenu.propTypes = {
  onGameStart: PropTypes.func.isRequired,
  /* eslint-disable */
  communication: PropTypes.object.isRequired,
  /* eslint-enable */
};

export default StartMenu;

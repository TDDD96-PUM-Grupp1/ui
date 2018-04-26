import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
      first: <FirstMenu showCreate={this.showCreate} showAbout={this.showAbout} />,

      create: (
        <CreateMenu
          onStart={this.props.onGameStart}
          onBack={this.showFirst}
          communication={this.props.communication}
        />
      ),
      // TODO add actual about page
      about: (
        <div>
          <button onClick={this.showFirst} className="menu-button">
            {'\u2B05'} Back
          </button>
        </div>
      ),
    };

    return (
      <div className="center-menu">
        <h1 className="game-title">Ball Game</h1>
        <div className="menu-button-holder">{menus[this.state.menu]}</div>
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

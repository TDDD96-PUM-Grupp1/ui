import React, { Component } from 'react';

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
      create: <CreateMenu onBack={this.showFirst} />,
      about: <div />, // TODO possibly add about page
    };

    return (
      <div className="center-menu">
        <h1 className="game-title">Ball Game</h1>
        <div className="menu-button-holder">{menus[this.state.menu]}</div>
      </div>
    );
  }
}

export default StartMenu;

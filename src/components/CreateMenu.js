import React, { Component } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_MAX_PLAYERS = 8;

class CreateMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gameModes: ['mode1', 'mode2', 'mode3'], // TODO get real list
      errors: []
    };

    this.startGame = this.startGame.bind(this);
    this.validatePlayers = this.validatePlayers.bind(this);
  }

  startGame() {
    // TODO
  }

  validatePlayers(event) {
    console.log(event.target.value); // TODO implement check
  }

  render() {
    return (
      <div className="create-menu">
        <h3 className="create-title">Create New Game</h3>
        <div className="menu-setting">
          <h4 className="menu-descriptor">Game Mode</h4>
          <select className="create-input">
            {this.state.gameModes.map(val => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
        <div className="menu-setting">
          <h4 className="menu-descriptor">Max Players</h4>
          <input
            className="create-input"
            defaultValue={DEFAULT_MAX_PLAYERS}
            type="number"
            onChange={this.validatePlayers}
          />
        </div>
        <button onClick={this.startGame} className="menu-button">
          Create
        </button>
        <button onClick={this.props.onBack} className="menu-button">
          {'\u2B05'} Back
        </button>
        <div className="error-list">{this.state.errors.map(error => <div>{error}</div>)}</div>
      </div>
    );
  }
}

CreateMenu.propTypes = {
  onBack: PropTypes.func.isRequired
};

export default CreateMenu;

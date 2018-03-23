import React, { Component } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_MAX_PLAYERS = 8;
const MAX_ALLOWED_PLAYERS = 100;

/*
Component showing a menu for setting up a new game
*/
class CreateMenu extends Component {
  constructor(props) {
    super(props);

    const availableModes = ['mode1', 'mode2', 'mode3']; // TODO get real list

    this.state = {
      gameModes: availableModes,
      errors: [],
      maxPlayers: DEFAULT_MAX_PLAYERS,
      gameMode: availableModes[0], // TODO fix with
    };

    this.startGame = this.startGame.bind(this);
    this.validatePlayers = this.validatePlayers.bind(this);
    this.updateGameMode = this.updateGameMode.bind(this);
  }

  /*
  Try to start new game when done setting options
  */
  startGame() {
    if (this.state.errors.length === 0) {
      // TODO startGame(this.state.gameMode, this.state.maxPlayers);
      this.props.onStart();
    }
  }

  /*
  Update the selected game mode.
  Event handler for a dropdown list.
  */
  updateGameMode(event) {
    const modeIndex = event.target.selectedIndex;
    const newMode = this.state.gameModes[modeIndex];

    this.setState({ gameMode: newMode });
  }

  /*
  Validate the selected player count,
  Event handler for an input field.
  */
  validatePlayers(event) {
    const newErrors = [];
    let newMax = this.state.maxPlayers;

    const maxVal = parseInt(event.target.value, 10);

    if (Number.isNaN(maxVal)) {
      newErrors.push('Unvalid max player limit');
    } else if (maxVal < 1) {
      newErrors.push('Max players has to be more than 1');
    } else if (maxVal > MAX_ALLOWED_PLAYERS) {
      newErrors.push(`Max players has to be less than ${MAX_ALLOWED_PLAYERS}`);
    } else {
      newMax = maxVal;
    }

    this.setState({ errors: newErrors, maxPlayers: newMax });
  }

  render() {
    return (
      <div className="create-menu">
        <h3 className="create-title">Create New Game</h3>
        <div className="menu-setting">
          <h4 className="menu-descriptor">Game Mode</h4>
          <select className="create-input" onChange={this.updateGameMode}>
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
        <div className="error-list">
          {this.state.errors.map(error => (
            <div className="error-box" key={error}>
              {error}
            </div>
          ))}
        </div>
        <button onClick={this.startGame} className="menu-button">
          Create
        </button>
        <button onClick={this.props.onBack} className="menu-button">
          {'\u2B05'} Back
        </button>
      </div>
    );
  }
}

CreateMenu.propTypes = {
  onBack: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
};

export default CreateMenu;

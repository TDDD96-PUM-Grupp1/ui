import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PulseLoader } from 'react-spinners';
import deepstream from 'deepstream.io-client-js';
import { Button, SelectField, TextField } from 'react-md';

import GamemodeHandler from '../game/GamemodeHandler';
import getRandomInstanceName from './InstanceNameHandler';

const DEFAULT_MAX_PLAYERS = 8;
const MAX_ALLOWED_PLAYERS = 100;

/*
Component showing a menu for setting up a new game
*/
class CreateMenu extends Component {
  constructor(props) {
    super(props);

    const gamemodeHandler = GamemodeHandler.getInstance();
    const gamemodeList = gamemodeHandler.getGamemodes();

    this.state = {
      instanceName: getRandomInstanceName(),
      errors: [],
      serviceError: false,
      maxPlayers: DEFAULT_MAX_PLAYERS,
      loading: false,
      gamemodeHandler,
      gamemodeList,
      gamemode: gamemodeList[0],
    };

    this.startGame = this.startGame.bind(this);
    this.validatePlayers = this.validatePlayers.bind(this);
    this.validateName = this.validateName.bind(this);
    this.updateGameMode = this.updateGameMode.bind(this);
    this.randomName = this.randomName.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  /*
  Try to start new game when done setting options
  */
  startGame() {
    if (this.state.errors.length === 0 || this.state.serviceError) {
      this.setState({ loading: true });
      this.setState({ errors: [] });

      // Set game mode
      this.state.gamemodeHandler.selectGameMode(this.state.gamemode);

      const gameInfo = {
        name: this.state.instanceName,
        maxPlayers: this.state.maxPlayers,
        gamemode: GamemodeHandler.getInstance().getSelectedId(),
        buttons: GamemodeHandler.getInstance().getButtons(),
      };
      // Try to create an instance (as the service if the instance name is unique).
      this.props.communication.createInstance(gameInfo, err => {
        this.setState({ loading: false });
        if (err) {
          if (err === deepstream.CONSTANTS.EVENT.NO_RPC_PROVIDER) {
            this.setState({ errors: ['Service is not responding.'], serviceError: true });
          } else {
            this.setState({ errors: [err], serviceError: true });
          }
        } else {
          // Instance is valid
          this.props.onStart();
        }
      });
    }
  }

  /*
   Request random name from the service.
   */
  randomName() {
    this.setState({ instanceName: getRandomInstanceName() });
    this.validateName(this.state.instanceName);
  }

  /*
  Update the selected game mode.
  Event handler for a dropdown list.
  */
  updateGameMode(event) {
    const modeIndex = event.target.selectedIndex;
    const newMode = this.state.gamemodeList[modeIndex];
    this.setState({ gamemode: newMode });
  }

  validateName(name) {
    const newErrors = [];
    if (name.length > 21) {
      newErrors.push('Name is too long.');
    } else if (name.length === 0) {
      newErrors.push('No name specified');
    }

    this.setState({ errors: newErrors, serviceError: false });
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

    this.setState({ errors: newErrors, maxPlayers: newMax, serviceError: false });
  }

  // Change the state if the textbox is changed.
  handleNameChange(value) {
    this.setState({ instanceName: value });
    this.validateName(value);
  }

  render() {
    return (
      <div className="create-menu">
        <h3 className="create-title">Create New Game</h3>
        <div className="menu-setting">
          <TextField
            className="create-input"
            label="Instance Name"
            placeholder="Type a name..."
            value={this.state.instanceName}
            onChange={this.handleNameChange}
          />
        </div>
        <div className="menu-setting">
          <h4 className="menu-descriptor">Game Mode</h4>
          <select className="create-input" onChange={this.updateGameMode}>
            {this.state.gamemodeList.map(val => (
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
        <div className="spinner">
          <PulseLoader color="#ffa000" loading={this.state.loading} />
        </div>
        <Button raised primary onClick={this.randomName} className="menu-button">
          Random Name
        </Button>
        <Button raised primary onClick={this.startGame} className="menu-button">
          Create
        </Button>
        <Button raised primary onClick={this.props.onBack} className="menu-button">
          Back
        </Button>
      </div>
    );
  }
}

CreateMenu.propTypes = {
  onBack: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  /* eslint-disable */
  communication: PropTypes.object.isRequired,
  /* eslint-enable */
};

export default CreateMenu;

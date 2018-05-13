import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PulseLoader } from 'react-spinners';
import deepstream from 'deepstream.io-client-js';
import { Button, SelectField, TextField } from 'react-md';

import GamemodeHandler from '../game/GamemodeHandler';
import getRandomInstanceName from './InstanceNameHandler';

const DEFAULT_MAX_PLAYERS = 8;
const MAX_ALLOWED_PLAYERS = 100;
const MAX_INSTANCE_NAME_LENGTH = 21;

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
      numberError: false,
      numberErrorMessage: '',
      nameLengthError: false,
      nameLengthErrorMessage: '',
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
        maxPlayers: parseInt(this.state.maxPlayers, 10),
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
    const randomName = getRandomInstanceName();
    this.setState({ instanceName: randomName });
    this.validateName(randomName);
  }

  /*
  Update the selected game mode.
  Event handler for a dropdown list.
  */
  updateGameMode(value, index) {
    const newMode = this.state.gamemodeList[index];
    this.setState({ gamemode: newMode });
  }

  validateName(name) {
    if (name.length > MAX_INSTANCE_NAME_LENGTH) {
      this.setState({
        nameLengthError: true,
        nameLengthErrorMessage: `Please enter a shorter name. ${
          name.length
        }/${MAX_INSTANCE_NAME_LENGTH}`,
      });
    } else if (name.length === 0) {
      this.setState({
        nameLengthError: true,
        nameLengthErrorMessage: `Please enter a name. ${name.length}/${MAX_INSTANCE_NAME_LENGTH}`,
      });
    } else {
      this.setState({
        nameLengthError: false,
        nameLengthErrorMessage: '',
      });
    }

    this.setState({ serviceError: false, errors: [], instanceName: name });
  }

  /*
  Validate the selected player count,
  Event handler for an input field.
  */
  validatePlayers(value) {
    if (parseFloat(value, 10) !== parseInt(value, 10) && !Number.isNaN(parseFloat(value, 10))) {
      this.setState({
        numberError: true,
        numberErrorMessage: 'Decimal numbers are not allowed.',
      });
    } else if (value <= 0) {
      this.setState({
        numberError: true,
        numberErrorMessage: 'Please enter a number larger than 0',
      });
    } else if (value > MAX_ALLOWED_PLAYERS) {
      this.setState({
        numberError: true,
        numberErrorMessage: `Please enter a number less than ${MAX_ALLOWED_PLAYERS}`,
      });
    } else {
      this.setState({
        numberError: false,
        numberErrorMessage: '',
      });
    }

    this.setState({ maxPlayers: value, errors: [], serviceError: false });
  }

  // Change the state if the textbox is changed.
  handleNameChange(value) {
    this.setState({ instanceName: value });
    this.validateName(value);
  }

  render() {
    return (
      <div className="create-menu">
        <div className="create-title">Create New Game</div>
        <div className="menu-setting">
          <TextField
            id="0" // Required
            className="create-input"
            label="Instance Name"
            placeholder="Type a name..."
            value={this.state.instanceName}
            onChange={this.handleNameChange}
            type="text"
            helpText={`${this.state.instanceName.length}/${MAX_INSTANCE_NAME_LENGTH}`}
            error={this.state.nameLengthError}
            errorText={this.state.nameLengthErrorMessage}
          />
        </div>
        <SelectField
          id="1" // Required
          label="Pick a gamemode"
          className="create-input"
          menuItems={this.state.gamemodeList}
          onChange={this.updateGameMode}
          value={this.state.gamemode}
          style={{
            textAlign: 'left',
            width: '100%',
          }}
          type="switch"
          position={SelectField.Positions.BOTTOM_RIGHT}
          sameWidth
        />
        <div className="menu-setting">
          <TextField
            id="2" // Required
            className="create-input"
            label="Max players"
            onChange={this.validatePlayers}
            type="number"
            value={this.state.maxPlayers}
            error={this.state.numberError}
            errorText={this.state.numberErrorMessage}
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
          <PulseLoader color="#2196F3" loading={this.state.loading} />
        </div>
        <Button raised primary onClick={this.randomName} className="menu-button">
          Random Name
        </Button>
        <Button
          disabled={this.state.nameLengthError || this.state.numberError}
          raised
          primary
          onClick={this.startGame}
          className="menu-button"
        >
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

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import PlayerInfo from './PlayerInfo';

/*
  A collection of PlayerList components to display information about connected players.
  Currently contains logic to fetch player data on a set frequency.
 */
class PlayerList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerList: {},
    };

    this.getPlayers = this.getPlayers.bind(this);
    setInterval(this.getPlayers, 100);
  }

  getPlayers() {
    const players = this.props.getPlayers();
    this.setState({
      playerList: players,
    });
  }

  render() {
    return (
      <div>
        {Object.keys(this.state.playerList).map(key => (
          <div key={key}>
            <PlayerInfo id={key} playerObject={this.state.playerList[key]} />
            <br />
          </div>
        ))}
      </div>
    );
  }
}

PlayerList.propTypes = {
  getPlayers: PropTypes.func.isRequired,
};

export default PlayerList;

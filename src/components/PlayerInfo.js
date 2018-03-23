import React from 'react';
import PropTypes from 'prop-types';

/*
Stateless component which displays information about a player
*/

const PlayerInfo = ({ id, playerObject }) => (
  <div>
    <div>{id}</div>
    <div>{playerObject.name}</div>
    <div>{Math.round(playerObject.sensor.beta)}</div>
    <div>{Math.round(playerObject.sensor.gamma)}</div>
  </div>
);

PlayerInfo.propTypes = {
  id: PropTypes.string.isRequired,
  /* eslint-disable react/forbid-prop-types */
  playerObject: PropTypes.object.isRequired,
  /* eslint-enable react/forbid-prop-types */
};

export default PlayerInfo;

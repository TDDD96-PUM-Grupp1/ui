import React from 'react';
import PropTypes from 'prop-types';

const PlayerInfo = ({ id, playerObject }) => (
  <div>
    <div>{id}</div>
    <div>{playerObject.name}</div>
    <div>{playerObject.sensor.beta}</div>
    <div>{playerObject.sensor.gamma}</div>
  </div>
);

PlayerInfo.propTypes = {
  id: PropTypes.string.isRequired,
  playerObject: PropTypes.object.isRequired,
};

export default PlayerInfo;

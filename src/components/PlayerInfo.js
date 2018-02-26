import React from 'react';
import PropTypes from 'prop-types';

const PlayerInfo = ({ id, playerObject }) => (
  <div>
    <div>{id}</div>
    <div>{playerObject.name}</div>
    <div>{playerObject.beta}</div>
    <div>{playerObject.gamma}</div>
  </div>
);

PlayerInfo.propTypes = {
  id: PropTypes.string.isRequired,
  playerObject: PropTypes.object.isRequired,
};

export default PlayerInfo;

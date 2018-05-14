import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from 'react-md';

import '../css/menu.css';

/*
  Infobox for game mode descriptions, Shown in CreateMenu.
*/
const Infobox = ({ gamemodeTitle, gamemodeDescription }) => (
  <Paper className="gamemode-infobox">
    <div className="infobox-title">{gamemodeTitle}</div>
    <div className="infobox-text">{gamemodeDescription}</div>
  </Paper>
);

Infobox.propTypes = {
  gamemodeTitle: PropTypes.string.isRequired,
  gamemodeDescription: PropTypes.string.isRequired,
};

export default Infobox;

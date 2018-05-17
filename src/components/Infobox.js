import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from 'react-md';

import '../css/menu.css';

function displayRules(gamemodeDescription) {
  if (gamemodeDescription === undefined || gamemodeDescription.length === 0) {
    return [<div> No Rules given! </div>];
  }

  const formatedInfo = gamemodeDescription.map((content, index) => {
    // Display gamemode rules
    if (index === 0) {
      return (
        <div key={content}>
          {content}
          <br />
          <br />
        </div>
      );
    }
    // Display gamemode abillities
    return (
      <div key={content}>
        {content}
        <br />
      </div>
    );
  });

  return formatedInfo;
}

/*
  Infobox for game mode descriptions, Shown in CreateMenu.
*/
const Infobox = ({ gamemodeTitle, gamemodeDescription }) => (
  <Paper className="gamemode-infobox">
    <div className="infobox-title">{gamemodeTitle}</div>
    <div className="infobox-text">{displayRules(gamemodeDescription).map(content => content)}</div>
  </Paper>
);

Infobox.propTypes = {
  gamemodeTitle: PropTypes.string.isRequired,
  /* eslint-disable-next-line */
  gamemodeDescription: PropTypes.array.isRequired,
};

export default Infobox;

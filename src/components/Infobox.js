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
    <div className="infobox-text">
      {gamemodeDescription.map((content, index) => {
        if (index === 0) {
          return (
            <div key={content}>
              {content}
              <br />
              <br />
            </div>
          );
        }
        return (
          <div key={content}>
            {content}
            <br />
          </div>
        );
      })}
    </div>
  </Paper>
);

Infobox.propTypes = {
  gamemodeTitle: PropTypes.string.isRequired,
  /* eslint-disable-next-line */
  gamemodeDescription: PropTypes.array.isRequired,
};

export default Infobox;

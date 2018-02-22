import React from 'react';
import PropTypes from 'prop-types';
import '../css/menu.css';

/*
The first menu shown when UI is started
*/
const FirstMenu = ({ showCreate, showAbout }) => (
  <div>
    <button onClick={showCreate} className="menu-button">
      Create Game
    </button>
    <button onClick={showAbout} className="menu-button">
      About
    </button>
  </div>
);

FirstMenu.propTypes = {
  showAbout: PropTypes.func.isRequired,
  showCreate: PropTypes.func.isRequired,
};

export default FirstMenu;

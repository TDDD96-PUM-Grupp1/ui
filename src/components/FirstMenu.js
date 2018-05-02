import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-md';

import '../css/menu.css';

/*
The first menu shown when UI is started
*/
const FirstMenu = ({ showCreate, showAbout }) => (
  <div>
    <Button raised primary onClick={showCreate} className="menu-button">
      Create Game
    </Button>
    <Button raised primary onClick={showAbout} className="menu-button">
      About
    </Button>
  </div>
);

FirstMenu.propTypes = {
  showAbout: PropTypes.func.isRequired,
  showCreate: PropTypes.func.isRequired,
};

export default FirstMenu;

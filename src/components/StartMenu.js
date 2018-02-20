import React from 'react';

// TODO replace placeholder functions with actual calls
const startGame = () => {};
const showAbout = () => {};

const StartMenu = () => (
  <div className="start-menu">
    <div className="center-menu">
      <h1 className="game-title">Ball Game</h1>
      <button onClick={startGame} className="menu-button">
        Create Game
      </button>
      <button onClick={showAbout} className="menu-button">
        About
      </button>
    </div>
  </div>
);

export default StartMenu;

import React from 'react';
import './css/App.css';
import Communication from './components/Communication';
import InstanceNameHandler from './components/InstanceNameHandler';
import StartMenu from './components/StartMenu';
import settings from './config';

function onConnect(success) {
  if (success) {
    console.log('Deepstream instanciated.');
  } else {
    // TODO: Maybe some form of indication to the user that the deepstream server is down.
    console.log("Couldn't instanciate deepstream connection.");
  }
}
const instanceNameHandler = new InstanceNameHandler();
const com = new Communication(settings.communication, onConnect);

const App = () => (
  <div className="App">
    <StartMenu
      getRandomInstanceName={instanceNameHandler.getRandomInstanceName}
      onCreateInstance={com.createInstance}
      onGetRandomName={com.getRandomName}
      getPlayers={com.getPlayers}
    />
  </div>
);

export default App;

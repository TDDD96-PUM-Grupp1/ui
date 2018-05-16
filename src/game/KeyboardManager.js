const MAX_ANGLE = 90;

/*
Manages keyboard input for playing the game when no sensor is present
*/
class KeyboardManager {
  constructor(onSensorChange, onButtonPress) {
    // Bind functions to be called
    this.onSensorChange = onSensorChange.bind(this);
    this.onButtonPress = onButtonPress;

    // Which directions are currently held
    this.directions = {
      up: false,
      down: false,
      right: false,
      left: false,
    };

    this.bindEventListener = this.bindEventListener.bind(this);
    this.unbindEventListener = this.unbindEventListener.bind(this);
    this.handleKeyboardInput = this.handleKeyboardInput.bind(this);
    this.calcSensorChange = this.calcSensorChange.bind(this);
  }

  /*
  Bind event listening to keys
  */
  bindEventListener() {
    // Event listener for device orientation
    window.addEventListener('keydown', this.handleKeyboardInput);
    window.addEventListener('keyup', this.handleKeyboardInput);
  }

  /*
  Remove binds for key-events
  */
  unbindEventListener() {
    // Make sure to unbind the event listener when component unmounts
    window.removeEventListener('keydown', this.handleKeyboardInput);
    window.removeEventListener('keyup', this.handleKeyboardInput);
  }

  /*
  Perform actions appropiate for the given key event
  */
  handleKeyboardInput(event) {
    const { key } = event;

    // true if event is keyDown
    const downFlag = event.type === 'keydown';
    let updateSensorValues = false;

    // Movement
    if (key === 'w' || key === 'ArrowUp') {
      this.directions.up = downFlag;
      updateSensorValues = true;
    } else if (key === 's' || key === 'ArrowDown') {
      this.directions.down = downFlag;
      updateSensorValues = true;
    } else if (key === 'd' || key === 'ArrowRight') {
      this.directions.right = downFlag;
      updateSensorValues = true;
    } else if (key === 'a' || key === 'ArrowLeft') {
      this.directions.left = downFlag;
      updateSensorValues = true;
    }

    // Update sensor values if applicable, else check for game button presses
    if (updateSensorValues) {
      this.calcSensorChange();
    } else if (key === '1') {
      this.onButtonPress(0);
    } else if (key === '2') {
      this.onButtonPress(1);
    } else if (key === '3') {
      this.onButtonPress(2);
    } else if (key === '4') {
      this.onButtonPress(3);
    }
  }

  // Translate keys pressed to an angle similar to if sensor-controls were used
  calcSensorChange() {
    let beta = 0;
    let gamma = 0;

    if (this.directions.up) {
      gamma += MAX_ANGLE;
    }
    if (this.directions.down) {
      gamma += -MAX_ANGLE;
    }
    if (this.directions.right) {
      beta += MAX_ANGLE;
    }
    if (this.directions.left) {
      beta += -MAX_ANGLE;
    }

    this.onSensorChange(beta, gamma);
  }
}

export default KeyboardManager;

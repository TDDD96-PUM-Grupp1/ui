/* eslint-disable prettier/prettier */
import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';
import KnockOff from './KnockOff';

// Respawn time in seconds

// The max time between a collision and a player dying in order to count as a kill.

// Constants for self-changing gameboard size
const maxRadius = 500;
const minRadius = 200;
const smallDec = 0.95;
const largeDec = 0.9;
const smallInc = 1.05;
const largeInc = 1.1;
const changeInterval = 60;

/*
  Knock off gamemode, get score by knocking other players off the arena.
*/
class KnockOffRandom extends KnockOff {
  // constructor(game) {
  //   super(game);
  // }

  /* eslint-disable no-unused-vars, class-methods-use-this */
  // Called before the game objects are updated.
  preUpdate(dt) {
    super.preUpdate(dt);
    // TODO make this a new gamemode
    // TODO make a gamemode where the circle shape changes non randomly
    if (this.changeCounter <= 0) {
      this.randomizeCircle();
      this.changeCounter = changeInterval;
    } else {
      this.changeCounter -= 1;
    }
  }

  /**
   * Randomly resizes the gamecircle, the radius changes with multiplication
   * and hence the circle's area may changes quite drastically on a single tick.
   */
  randomizeCircle() {
    const change = Math.floor(Math.random() * Math.floor(4));
    let multiplier;

    switch (change) {
      case 0:
        multiplier = smallInc;
        break;
      case 1:
        multiplier = largeInc;
        break;
      case 2:
        multiplier = smallDec;
        break;
      case 3:
        multiplier = largeDec;
        break;
      default:
        throw Error('Change must be a number between 0 and 3');
    }

    // Since we only change the PIXI object through scale we can't
    // set it to a constant, hence only the else does something
    if (this.arenaRadius * multiplier > maxRadius) {
      // this.arenaRadius = maxRadius;
    } else if (this.arenaRadius * multiplier < minRadius) {
      // this.arenaRadius = minRadius;
    } else {
      this.arenaRadius *= multiplier;
      this.mainCircle.scale.x *= multiplier;
      this.mainCircle.scale.y *= multiplier;
    }
  }

  /* eslint-disable class-methods-use-this */
}

export default KnockOffRandom;

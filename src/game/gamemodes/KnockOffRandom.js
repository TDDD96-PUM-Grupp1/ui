import KnockOff from './KnockOff';

// Constants for self-changing gameboard size
const maxRadius = 500;
const minRadius = 200;
const smallDec = 0.95;
const largeDec = 0.9;
const smallInc = 1.05;
const largeInc = 1.1;
const changeInterval = 25;

/*
  Knock off gamemode with a randomly changing arena, get score by knocking other players off the it.
*/
class KnockOffRandom extends KnockOff {
  constructor(game, resources) {
    super(game, resources);
    this.changeCounter = changeInterval;

    // Sanity check since you set the radius and its bonds in different files
    if (this.arenaRadius > maxRadius || this.arenaRadius < minRadius) {
      throw Error('Contradicting radius and radius bonds');
    }
  }

  // Called before the game objects are updated.
  preUpdate(dt) {
    super.preUpdate(dt);
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
}

export default KnockOffRandom;

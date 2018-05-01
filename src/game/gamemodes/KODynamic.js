import KnockOff from './KnockOff';

// Constants for self-changing gameboard size
const maxRadius = 500;
const minRadius = 200;
const multInc = 1.01;
const multDec = 0.99;

/*
  Knock off gamemode with a randomly changing arena, get score by knocking other players off the it.
*/
class KODynamic extends KnockOff {
  constructor(game, resources) {
    super(game, resources);
    this.expanding = false;

    // Sanity check since you set the radius and its bonds in different files
    if (this.arenaRadius > maxRadius || this.arenaRadius < minRadius) {
      throw Error('Contradicting radius and radius bonds');
    }
  }

  // Called before the game objects are updated.
  preUpdate(dt) {
    super.preUpdate(dt);
    this.modifyCircle();
  }

  /**
   * Changes the circles size untill it would over-shoot the min/max size,
   * then it changes its direction of change.
   */
  modifyCircle() {
    if (this.expanding) {
      // We can't expand without over-shooting the max radius
      if (this.arenaRadius * multInc > maxRadius) {
        this.expanding = false;
      } else {
        // Expand
        this.arenaRadius *= multInc;
        this.arenaGraphic.scale.x *= multInc;
        this.arenaGraphic.scale.y *= multInc;
      }
    } else {
      // We can't shrink any more
      // eslint-disable-next-line
      if (this.arenaRadius * multDec < minRadius) {
        this.expanding = true;
      } else {
        // Shrink the circle
        this.arenaRadius *= multDec;
        this.arenaGraphic.scale.x *= multDec;
        this.arenaGraphic.scale.y *= multDec;
      }
    }
  }
}

export default KODynamic;

import * as PIXI from 'pixi.js';
import { OutlineFilter } from 'pixi-filters';
import BasicCircle from './BasicCircle';

const RADIUS = 32;
const MASS = 1;
const SQUAREROOTOF2 = 1.4142135623730951;
const ICONSIZE = Math.floor(RADIUS * SQUAREROOTOF2);

/* eslint-disable */
/* hexToComplimentary : Converts hex value to HSL, shifts
 * hue by 180 degrees and then converts hex, giving complimentary color
 * as a hex value
 * @param  [String] hex : hex value  
 * @return [String] : complimentary color as hex value
 */
function hexToComplimentary(hex) {
  var r = hex >> 16,
    g = (hex >> 8) & 0x00ff,
    b = hex & 0xff;

  // Convert RGB to HSL
  // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
  r /= 255.0;
  g /= 255.0;
  b /= 255.0;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2.0;

  if (max == min) {
    h = s = 0; //achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2.0 - max - min) : d / (max + min);

    if (max == r && g >= b) {
      h = 1.0472 * (g - b) / d;
    } else if (max == r && g < b) {
      h = 1.0472 * (g - b) / d + 6.2832;
    } else if (max == g) {
      h = 1.0472 * (b - r) / d + 2.0944;
    } else if (max == b) {
      h = 1.0472 * (r - g) / d + 4.1888;
    }
  }

  h = h / 6.2832 * 360.0 + 0;

  // Shift hue to opposite side of wheel and convert to [0-1] value
  h += 180;
  if (h > 360) {
    h -= 360;
  }
  h /= 360;

  // Convert h s and l values into r g and b values
  // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  // Convert r b and g values to hex
  return b | (g << 8) | (r << 16);
}
/* eslint-enable */

/*
Game object representing a player
*/
class PlayerCircle extends BasicCircle {
  constructor(app, resource) {
    super(app, RADIUS, MASS, 0xff6600);

    this.sprite = new PIXI.Sprite(resource);
    this.sprite.width = ICONSIZE;
    this.sprite.height = ICONSIZE;
    // Center x,y
    this.sprite.anchor.set(0.5, 0.5);

    this.graphic.addChild(this.sprite);

    this.sprite.filters = [new OutlineFilter(1.5, 0, 0.15)];

    // complement
    this.sprite.tint = hexToComplimentary(this.graphic.tint);

    // set collision group
    this.collisionGroup = 1;
  }

  // Update this object
  update(dt) {
    super.update(dt);
  }

  // Set the graphic tint
  setColor(color) {
    this.graphic.tint = color;
    // complement
    this.sprite.tint = hexToComplimentary(this.graphic.tint);
  }

  // Update this entity's graphics
  // graphicUpdate(dt) {
  //   super.graphicUpdate(dt);

  //   this.sprite.x = this.x;
  //   this.sprite.y = this.y;
  //   this.sprite.rotation = this.rotation;
  // }

  // Destroy sprite when removed
  destroy() {
    super.destroy();
    this.sprite.destroy();
  }

  /* eslint-disable */
  isPlayer() {
    return true;
  }
  /* eslint-enable */
}

export default PlayerCircle;

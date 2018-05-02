import * as PIXI from 'pixi.js';

const NAME_MARGIN = 5;

class InstanceNameGraphic {
  constructor(game) {
    this.graphic = new PIXI.Text(
      game.instance.getName(),
      new PIXI.TextStyle({
        fill: '#FFFFFF',
        fontSize: 36,
        fontFamily: 'sans-serif',
      })
    );

    this.graphic.alpha = 0.8;
    this.graphic.anchor.set(1, 0);
    this.graphic.y = 0;
    this.reposition();
    game.app.stage.addChild(this.graphic);
  }

  reposition() {
    this.graphic.x = window.innerWidth - NAME_MARGIN;
  }
}

export default InstanceNameGraphic;

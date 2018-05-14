import * as PIXI from 'pixi.js';

const NAME_MARGIN = 5;

class InstanceNameGraphic {
  constructor(game) {
    this.game = game;
    this.graphic = new PIXI.Text(
      game.instance.getName(),
      new PIXI.TextStyle({
        fill: '#FFFFFF',
        fontSize: 36,
        fontFamily: ['Trebuchet MS', 'sans-serif'],
      })
    );

    this.graphic.alpha = 0.8;
    this.graphic.anchor.set(1, 0);
    this.graphic.y = 0;
    this.reposition();
    game.staticStage.addChild(this.graphic);
  }

  reposition() {
    this.graphic.x = window.innerWidth / this.game.staticStage.scale.x - NAME_MARGIN;
  }
}

export default InstanceNameGraphic;

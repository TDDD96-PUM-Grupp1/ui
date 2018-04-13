import * as PIXI from 'pixi.js';

const BG_COLOR = '0xFEFEFE';

class HighscoreList extends PIXI.Container{
  constructor(scoreManager){
    super();
    this.scoreManager = scoreManager;
    this.scoreManager.addScoreListener(this);

    this.update();
  }

  update(){
    this.removeChildren();
    const list = this.scoreManager.getList();

    // Background
    let bg = new PIXI.Graphics();
    bg.beginFill(BG_COLOR, 1);
    bg.drawRect(0, 0, 500, 500);

    list.forEach((val, index) => {
      let name = new PIXI.Text(val.name);
      name.x = 0;
      name.y = index*30;

      this.addChild(name);
    });

    this.addChild(bg);
  }
}

export default HighscoreList;

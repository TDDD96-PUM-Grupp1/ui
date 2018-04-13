import * as PIXI from 'pixi.js';

const BG_COLOR = '0xFFFFFF';
const TEXT_COLOR = '#000000';

class HighscoreList{
  constructor(scoreManager, game){
    this.scoreManager = scoreManager;
    this.scoreManager.addScoreListener(this);

    this.container = new PIXI.Container();

    this.rows = {};

    game.app.stage.addChild(this.container);
    this.update();
  }

  update() {
    const list = this.scoreManager.getList();

    const textStyle = new PIXI.TextStyle({
      fill: TEXT_COLOR,
      fontSize: 20,
    });

    // Reset painted variable
    Object.keys(this.rows).forEach((key, index) => {
      this.rows[key].painted = false;
    });

    list.forEach((val, index) => {
      // Background
      if(val.id in this.rows){
        // Row exists
        let curRow = this.rows[val.id];

        // TODO Update highscore list graphics component

        curRow.painted = true;
      } else {
        // New player
        let rowCont = new PIXI.Container();

        let bg = new PIXI.Graphics();
        bg.beginFill(BG_COLOR, 1);
        bg.drawRect(0, 50*index, 300, 50);
        bg.endFill();

        let name = new PIXI.Text(val.name, textStyle);
        name.x = 0;
        name.y = 50*index;

        rowCont.addChild(bg);
        rowCont.addChild(name);

        let newRow = {
          painted: true,
          row: rowCont,
        };

        this.rows[val.id] = newRow;
        this.container.addChild(rowCont);
      }
    });

    Object.keys(this.rows).forEach((key, index) => {
      console.log('Check if painted');
      if(!this.rows[key].painted){
        console.log('Remove');
        this.container.removeChild(this.rows[key].row);
        delete this.rows[key];
      }
    });
  }
}

export default HighscoreList;

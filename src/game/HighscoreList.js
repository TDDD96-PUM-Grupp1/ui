import * as PIXI from 'pixi.js';

const BG_COLOR = '0x5C5C5C';
const TEXT_COLOR = '#FFFFFF';

const TEXT_PADDING = 7;
const NAME_WIDTH = 200;

const TEXT_STYLE = new PIXI.TextStyle({
  fill: TEXT_COLOR,
  fontSize: 20,
});

class HighscoreList {
  constructor(scoreManager, game, x = 0, y = 0) {
    this.scoreManager = scoreManager;
    this.scoreManager.addScoreListener(this);

    this.container = new PIXI.Container();
    this.container.x = x;
    this.container.y = y;

    this.rows = {};

    this.rect_height = 0;
    this.rect_width = 0;
    this.widths = [];

    game.app.stage.addChild(this.container);

    this.paintHeading();
    this.update();
  }

  paintHeading() {
    const scores = this.scoreManager.getScores();

    let metrics;
    this.rect_width = NAME_WIDTH;

    scores.forEach(val => {
      metrics = PIXI.TextMetrics.measureText(val, TEXT_STYLE);
      this.widths.push(metrics.width);
      this.rect_width = this.rect_width + metrics.width + 2 * TEXT_PADDING;
    });

    this.rect_height = metrics.height + 2 * TEXT_PADDING;

    // Draw background
    const bg = new PIXI.Graphics();
    bg.beginFill(BG_COLOR, 1);
    bg.lineStyle(2, 0x000000, 1);
    bg.drawRoundedRect(0, 0, this.rect_width, this.rect_height, 9);
    bg.endFill();
    this.container.addChild(bg);

    let curX = TEXT_PADDING;
    for (let i = 0; i < scores.length; i += 1) {
      const text = new PIXI.Text(scores[i], TEXT_STYLE);
      text.x = NAME_WIDTH + curX;
      curX = curX + this.widths[i] + TEXT_PADDING;
      text.y = TEXT_PADDING;
      this.container.addChild(text);
    }
  }

  update() {
    const list = this.scoreManager.getList();
    const scores = this.scoreManager.getScores();

    // Reset painted variable
    Object.keys(this.rows).forEach(key => {
      this.rows[key].painted = false;
    });

    list.forEach((val, index) => {
      // Background
      if (val.id in this.rows) {
        // Row exists
        const curRow = this.rows[val.id];

        // Update needd scores
        scores.forEach(scoreName => {
          if (curRow[scoreName].text !== val[scoreName].toString()) {
            curRow[scoreName].text = val[scoreName];
          }
        });

        // Move box to right position
        curRow.row.y = this.rect_height * (index + 1);

        curRow.painted = true;
      } else {
        // New player
        const rowCont = new PIXI.Container();
        rowCont.x = 0;
        rowCont.y = this.rect_height * (index + 1);

        const bg = new PIXI.Graphics();
        bg.beginFill(BG_COLOR, 1);
        bg.lineStyle(2, 0x000000, 1);
        bg.drawRoundedRect(0, 0, this.rect_width, this.rect_height, 9);
        bg.endFill();

        const name = new PIXI.Text(val.name, TEXT_STYLE);
        name.x = TEXT_PADDING;
        name.y = TEXT_PADDING;

        rowCont.addChild(bg);
        rowCont.addChild(name);

        const newRow = {
          painted: true,
          row: rowCont,
        };

        let scoreAdjust = TEXT_PADDING;
        scores.forEach((scoreName, scoreI) => {
          const text = new PIXI.Text(val[scoreName], TEXT_STYLE);
          text.x = NAME_WIDTH + scoreAdjust;
          scoreAdjust = scoreAdjust + this.widths[scoreI] + TEXT_PADDING;
          text.y = TEXT_PADDING;

          newRow[scoreName] = text;
          rowCont.addChild(text);
        });

        this.rows[val.id] = newRow;
        this.container.addChild(rowCont);
      }
    });

    // Remove disconnected players from list
    Object.keys(this.rows).forEach(key => {
      if (!this.rows[key].painted) {
        this.container.removeChild(this.rows[key].row);
        delete this.rows[key];
      }
    });
  }
}

export default HighscoreList;

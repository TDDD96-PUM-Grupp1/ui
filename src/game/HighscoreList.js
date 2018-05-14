import * as PIXI from 'pixi.js';
import iconData from './iconData';
import PlayerCircle from './entities/PlayerCircle';

const BG_COLOR = '0x878787';
const TEXT_COLOR = '#FFFFFF';
const BORDER_COLOR = '0x000000';

const BORDER_WIDTH = 0;
const OPACITY = 0.75;

const TEXT_PADDING = 7;
const NAME_WIDTH = 250;

const BOX_RADIUS = 0;
const BOX_SPACING = 3;

const ICON_SIZE = 28;

const MAX_DECIMALS = 1;

const TEXT_STYLE = new PIXI.TextStyle({
  fill: TEXT_COLOR,
  fontSize: 26,
  fontFamily: 'sans-serif',
});

class HighscoreList {
  constructor(scoreManager, game, x = 0, y = 0) {
    this.scoreManager = scoreManager;
    this.scoreManager.addScoreListener(this);

    this.container = new PIXI.Container();
    this.container.alpha = OPACITY;
    this.container.x = x;
    this.container.y = y;

    this.rows = {};

    this.rect_height = 0;
    this.rect_width = 0;
    this.widths = [];

    this.game = game;
    game.staticStage.addChild(this.container);

    this.paintHeading();
    this.update();
  }

  /*
  Paint the heading with explanations to different score types
  */
  paintHeading() {
    const scores = this.scoreManager.getScores();

    let metrics;
    const startX = NAME_WIDTH + ICON_SIZE + 3 * TEXT_PADDING;
    this.rect_width = startX;

    scores.forEach(val => {
      metrics = PIXI.TextMetrics.measureText(val, TEXT_STYLE);
      this.widths.push(metrics.width);
      this.rect_width = this.rect_width + metrics.width + TEXT_PADDING;
    });

    this.rect_height = metrics.height + 2 * TEXT_PADDING;

    // Draw background
    const bg = new PIXI.Graphics();
    bg.beginFill(BG_COLOR, 1);
    bg.lineStyle(BORDER_WIDTH, BORDER_COLOR, 1);
    bg.drawRoundedRect(0, 0, this.rect_width, this.rect_height, BOX_RADIUS);
    bg.endFill();
    this.container.addChild(bg);

    let curX = startX;
    for (let i = 0; i < scores.length; i += 1) {
      const text = new PIXI.Text(scores[i], TEXT_STYLE);
      text.x = curX;
      curX = curX + this.widths[i] + TEXT_PADDING;
      text.y = TEXT_PADDING;
      this.container.addChild(text);
    }
  }

  /*
  Update the drawing of the ghighscorelist
  */
  update() {
    const list = this.scoreManager.getList();
    const scores = this.scoreManager.getScores();
    const styles = this.scoreManager.styleGuide;

    // Reset painted variable
    Object.keys(this.rows).forEach(key => {
      this.rows[key].painted = false;
    });

    list.forEach((val, index) => {
      // Background
      if (val.id in this.rows) {
        // Row exists
        const curRow = this.rows[val.id];

        // Update needed scores
        scores.forEach(scoreName => {
          if (curRow[scoreName].text !== val[scoreName].toString()) {
            let value = val[scoreName];
            if (value.toFixed) {
              value = +value.toFixed(MAX_DECIMALS);
            }
            curRow[scoreName].text = value;
          }
        });

        // Move box to right position
        curRow.row.y = (this.rect_height + BOX_SPACING) * (index + 1);
        curRow.painted = true;
      } else {
        // New player
        const rowCont = new PIXI.Container();
        rowCont.x = 0;
        rowCont.y = (this.rect_height + BOX_SPACING) * (index + 1);

        const bg = new PIXI.Graphics();
        bg.beginFill(BG_COLOR, 1);
        bg.lineStyle(BORDER_WIDTH, BORDER_COLOR, 1);
        bg.drawRoundedRect(0, 0, this.rect_width, this.rect_height, BOX_RADIUS);
        bg.endFill();

        const name = new PIXI.Text(val.name, TEXT_STYLE);
        name.x = TEXT_PADDING * 2 + ICON_SIZE;
        name.y = TEXT_PADDING;
        // This is the string we remove one from to easier add ... after name.text.
        let minifiedName = val.name;
        while (name.width > NAME_WIDTH && minifiedName.length > 0) {
          // Decrease the length by 1
          minifiedName = minifiedName.substring(0, minifiedName.length - 1);
          name.text = `${minifiedName}...`;
        }

        // Circle icon
        const iconPath = iconData[styles[val.id].iconID].img;
        const iconName = iconData[styles[val.id].iconID].name;
        this.game.resourceServer
          .requestResources([
            {
              name: iconName,
              path: iconPath,
            },
          ])
          .then(res => {
            const playerModel = new PlayerCircle(this.game, res[iconName]);

            const iconColor = Number.parseInt(styles[val.id].iconColor.substr(1), 16);
            const backgroundColor = Number.parseInt(styles[val.id].backgroundColor.substr(1), 16);
            playerModel.setColor(backgroundColor, iconColor);

            const icon = playerModel.graphic;
            icon.height = ICON_SIZE;
            icon.width = ICON_SIZE;
            icon.x = this.rect_height / 2;
            icon.y = this.rect_height / 2;
            rowCont.addChild(icon);
          });

        rowCont.addChild(bg);
        rowCont.addChild(name);

        const newRow = {
          painted: true,
          row: rowCont,
        };

        let scoreAdjust = NAME_WIDTH + 3 * TEXT_PADDING + ICON_SIZE;
        scores.forEach((scoreName, scoreI) => {
          let value = val[scoreName];
          if (value.toFixed) {
            value = +value.toFixed(MAX_DECIMALS);
          }
          const text = new PIXI.Text(value, TEXT_STYLE);
          text.x = scoreAdjust;
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

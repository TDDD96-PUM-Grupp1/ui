import * as PIXI from 'pixi.js';
import Gamemode from './Gamemode';
import BasicCircle from '../entities/BasicCircle';
import BasicLine from '../entities/BasicLine';

// Higher resolution might cause rendering lag
const FONT_RESOLUTION = 400;
const SCALE = 300 / FONT_RESOLUTION;

// Shuffle a list
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.ceil(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/*
  Hockey gamemode, get the ball into the other teams goal!
*/
class Hockey extends Gamemode {
  constructor(game) {
    super(game);
    this.team1 = [];
    this.team2 = [];

    this.scaleHeight = 750;

    const ball = new BasicCircle(this.game, 20, 0.5, 0xdddddd, true);
    ball.x = 0;
    ball.y = 0;
    ball.collisionGroup = 4;
    this.game.register(ball);
    // ball.dynamicFriction = 0.5;
    this.ball = ball;

    this.topLine = this.addLine(-5000, 0, 5000, 0);
    this.bottomLine = this.addLine(-5000, 0, 5000, 0);
    this.rightLine = this.addLine(0, -500, 0, 500);
    this.leftLine = this.addLine(0, -500, 0, 500);
    this.leftLine.collisionGroup = 4;
    this.rightLine.collisionGroup = 4;

    this.displayContainer = new PIXI.Container();
    this.team1Score = 0;
    this.team2Score = 0;
    this.team1Display = this.addScoreDisplay('#AAAAFF', -200);
    this.team2Display = this.addScoreDisplay('#FFAAAA', 200);
    this.game.gameStage.addChildAt(this.displayContainer, 0);
    this.displayContainer.alpha = 0.5;

    this.team1Zone = this.addGoalZone(0xaaaaff, -500);
    this.team2Zone = this.addGoalZone(0xffaaaa, 500);
  }

  addLine(x, y, ex, ey) {
    const line = new BasicLine(this.game, x, y, ex, ey, 0x6633ff);
    line.staticFriction = 0;
    line.dynamicFriction = 0;
    line.restitution = 0.3;
    line.collisionGroup = 0;
    line.graphic.visible = false;
    this.game.register(line);
    return line;
  }

  addGoalZone(color, x) {
    const width = 100;
    const height = this.scaleHeight;
    const zone = new PIXI.Graphics();
    zone.beginFill(color);
    zone.drawRect(-width * 0.5, -height * 0.5, width, height);
    zone.endFill();
    zone.x = x;
    zone.alpha = 0.5;
    this.displayContainer.addChild(zone);
    return zone;
  }

  addScoreDisplay(color, x) {
    const display = new PIXI.Text(
      '0',
      new PIXI.TextStyle({
        fill: color,
        fontSize: 300 / SCALE,
        fontFamily: ['Trebuchet MS', 'sans-serif'],
        strokeThickness: 3 / SCALE,
      })
    );
    display.anchor.set(0.5, 0.5);
    display.x = x;
    display.scale.set(SCALE, SCALE);
    this.displayContainer.addChild(display);
    return display;
  }

  resetBall() {
    this.ball.resetPhysics();
    this.ball.x = 0;
    this.ball.y = 0;
    this.ball.phase(2);
    this.resetPlayers();
  }

  resetPlayers() {
    this.team1 = shuffle(this.team1);
    this.team2 = shuffle(this.team2);

    let counter = 0.5;
    const dist = -this.scaleHeight / 2 + 50;
    const angleStart = Math.atan2(-this.scaleHeight + 50, dist);
    const angleEnd = Math.atan2(this.scaleHeight - 50, dist);
    const angleSpan = Math.atan2(Math.sin(angleEnd - angleStart), Math.cos(angleEnd - angleStart));
    let angleSlice = angleSpan / this.team1.length;
    this.team1.forEach(player => {
      const entity = this.players[player];
      entity.resetPhysics();
      entity.phase(1.3);

      const angle = angleStart + angleSlice * counter;
      entity.x = -dist * Math.cos(angle);
      entity.y = dist * Math.sin(angle);

      counter += 1;
    });

    counter = 0.5;
    angleSlice = angleSpan / this.team2.length;
    this.team2.forEach(player => {
      const entity = this.players[player];
      entity.resetPhysics();
      entity.phase(1.3);

      const angle = angleStart + angleSlice * counter;
      entity.x = dist * Math.cos(angle);
      entity.y = dist * Math.sin(angle);

      counter += 1;
    });
  }

  // Called after the game objects are updated.
  postUpdate() {
    if (this.ball.x < -this.game.gameStageWidth * 0.5) {
      // Team 2 scored!
      this.team2Score += 1;
      this.team2Display.text = this.team2Score;
      this.resetBall();
    } else if (this.ball.x > this.game.gameStageWidth * 0.5) {
      // Team 1 scored!
      this.team1Score += 1;
      this.team1Display.text = this.team1Score;
      this.resetBall();
    }
  }

  // Called when a new player has been created
  onPlayerCreated(playerObject, circle) {
    const { id } = playerObject;

    circle.dynamicFriction = 0;

    if (this.team2.length >= this.team1.length) {
      // join team 1
      this.team1.push(id);
      circle.team = 1;
      circle.collisionGroup = 1;
      circle.setColor(0x3333ff);
      circle.x = -200;
      circle.y = 0;
    } else {
      // join team 2
      this.team2.push(id);
      circle.team = 2;
      circle.collisionGroup = 2;
      circle.setColor(0xff3333);
      circle.x = 200;
      circle.y = 0;
    }
  }

  onPlayerLeave(id) {
    const entity = this.players[id];
    if (entity.team === 1) {
      this.team1 = this.team1.filter(player => id !== player);
    } else {
      this.team2 = this.team2.filter(player => id !== player);
    }
  }

  onWindowResize() {
    const width = this.game.gameStageWidth * 0.5;
    const height = this.game.gameStageHeight * 0.5;
    this.topLine.y = -height;
    this.bottomLine.y = height;
    this.rightLine.x = width;
    this.leftLine.x = -width;

    this.team1Zone.x = -width;
    this.team2Zone.x = width;
  }

  static getConfig() {
    return {
      joinPhase: 2,
      moveWhilePhased: false,
      rules: [
        'Play as a team and try to score by bumping the puck into the goal of the opposite team!',
        'Abilities:',
        'Speed Boost - Increases the speed of the player for more scoring potential!',
      ],
      leave: {
        removeTime: 3,
      },
      abilities: [
        {
          name: 'Speed Boost',
          cooldown: 10,
          duration: 3,
          color: '#0099ff',
          activateFunc: entity => {
            entity.vx *= 2;
            entity.vy *= 2;
          },
          deactivateFunc: () => {},
        },
      ],
    };
  }
}

export default Hockey;

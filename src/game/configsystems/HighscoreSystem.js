import ConfigSystem from './ConfigSystem';
import HighscoreList from '../HighscoreList';

/* eslint-disable no-unused-vars */
const EVENT_TRIGGER_DEATH = 0;
const EVENT_TRIGGER_KILL = 1;

const EVENT_ACTION_RESET = 0;
const EVENT_ACTION_INCREMENT = 1;
const EVENT_ACTION_DECREMENT = 2;

const HIGHSCORE_ORDER_ASCENDING = true;
const HIGHSCORE_ORDER_DESCENDING = false;

const HIGHSCORE_DISPLAY_TIME = 0;
const HIGHSCORE_DISPLAY_LATENCY = 1;
const HIGHSCORE_DISPLAY_BEST = name => ({ type: 'best', target: name });
/* eslint-enable no-unused-vars */

class HighscoreSystem extends ConfigSystem {
  constructor(handler, options) {
    super(handler, options);

    this.onDeathEvents = [];
    this.onKillEvents = [];

    this.advancedDisplays = [];
    this.timeDisplays = [];
  }

  setup() {
    const binds = {};
    if (this.options.highscore.order) {
      this.game.scoreManager.setAscOrder(this.options.highscore.order);
    }
    Object.keys(this.options.highscore.scores).forEach(title => {
      const score = this.options.highscore.scores[title];
      const name = title.replace(/_/g, ' ');
      const { initial, primary } = score;
      this.game.scoreManager.addScoreType(name, initial, primary);
    });
    this.gamemode.hs_list = new HighscoreList(this.game.scoreManager, this.game);

    this.setUpHighscoreEvents();

    if (this.timeDisplays.length > 0) {
      binds.preUpdate = true;
    }
    if (this.onDeathEvents.length > 0) {
      binds.onPlayerCreated = true;
    }
    if (this.advancedDisplays.length > 0) {
      binds.postUpdate = true;
    }

    return binds;
  }

  attachHooks() {
    if (this.onKillEvents.length > 0) {
      this.handler.hookUp('kill', this.onKill.bind(this));
    }
  }

  setUpHighscoreEvents() {
    Object.keys(this.options.highscore.scores).forEach(title => {
      const highscore = this.options.highscore.scores[title];
      const name = title.replace(/_/g, ' ');
      const { initial, display, events } = highscore;
      if (display !== undefined) {
        switch (display) {
          case HIGHSCORE_DISPLAY_TIME:
            this.timeDisplays.push({ name });
            break;
          case HIGHSCORE_DISPLAY_LATENCY:
            // Displayed through event from instance by game core.
            break;
          default:
            if (display.type) {
              const { type, target } = display;
              let cond;
              let update;
              switch (type) {
                case 'best':
                  cond = (stored, comp) => comp > stored;
                  update = (stored, comp) => comp;
                  break;
                default:
                  throw new Error(`Invalid advanced display type '${type}'.`);
              }
              // Prettier wants this line on 1 row but eslint wants it spread out...
              // eslint-disable-next-line
              this.advancedDisplays.push({ name, target, cond, update });
            } else {
              throw new Error(`Invalid display type '${display}'.`);
            }
        }
      }
      if (events !== undefined) {
        events.forEach(event => {
          const { trigger, action } = event;
          let actionFunc;
          switch (action) {
            case EVENT_ACTION_RESET:
              actionFunc = () => initial;
              break;
            case EVENT_ACTION_INCREMENT:
              actionFunc = n => n + 1;
              break;
            case EVENT_ACTION_DECREMENT:
              actionFunc = n => n - 1;
              break;
            default:
              throw new Error(`Invalid event action '${action}'.`);
          }
          switch (trigger) {
            case EVENT_TRIGGER_DEATH:
              this.onDeathEvents.push({ name, action: actionFunc });
              break;
            case EVENT_TRIGGER_KILL:
              this.onKillEvents.push({ name, action: actionFunc });
              break;
            default:
              throw new Error(`Invalid event trigger '${trigger}'.`);
          }
        });
      }
    });
  }

  preUpdate(dt) {
    this.timeDisplays.forEach(display => {
      const { name } = display;
      this.game.entityHandler.getPlayers().forEach(entity => {
        if (!entity.isDead) {
          const { id } = entity.controller;
          this.game.scoreManager.addScore(name, id, dt);
        }
      });
    });
  }

  postUpdate() {
    const players = Object.keys(this.gamemode.players);
    this.advancedDisplays.forEach(display => {
      // Prettier wants this line on 1 row but eslint wants it spread out...
      // eslint-disable-next-line
      const { name, target, cond, update } = display;
      players.forEach(id => {
        const current = this.game.scoreManager.getScore(name, id);
        const score = this.game.scoreManager.getScore(target, id);
        if (cond(current, score)) {
          this.game.scoreManager.setScore(name, id, update(current, score));
        }
      });
    });
  }

  onPlayerCreated(playerObject, circle) {
    circle.addDeathListener(this.onDeath.bind(this));
  }

  onDeath(entity) {
    if (!entity.playerLeft) {
      const { id } = entity.controller;
      this.onDeathEvents.forEach(event => {
        const { name, action } = event;
        this.game.scoreManager.mutateScore(name, id, action);
      });
    }
  }

  onKill(params) {
    const { killer } = params;
    this.onKillEvents.forEach(event => {
      const { name, action } = event;
      this.game.scoreManager.mutateScore(name, killer, action);
    });
  }
}

export default HighscoreSystem;

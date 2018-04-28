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
/* eslint-enable no-unused-vars */

class GamemodeEventHandler {
  constructor(game, gamemode, options) {
    this.game = game;
    this.binds = {};
    this.gamemode = gamemode;
    this.options = options;

    this.onDeathEvents = [];
    this.onKillEvents = [];
  }

  setUpHighscoreEvents() {
    Object.keys(this.options.highscore.scores).forEach(title => {
      const score = this.options.highscore.scores[title];
      const name = title.replace(/_/g, ' ');
      const { initial, display, events } = score;
      if (display !== undefined) {
        switch (display) {
          case HIGHSCORE_DISPLAY_TIME:
            break;
          case HIGHSCORE_DISPLAY_LATENCY:
            break;
          default:
            break;
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

  // eslint-disable-next-line
  injectBinds() {
    this.injectBind('onDeath');
    this.injectBind('preUpdate');
    this.injectBind('postUpdate');
    this.injectBind('onPlayerCreated');
    this.injectBind('onPlayerLeave');
    this.injectBind('onRespawn');
  }

  injectBind(func) {
    const temp = this.gamemode[func];
    this.gamemode[func] = this[func].bind(this);
    this.binds[func] = temp.bind(this.gamemode);
  }

  preUpdate(dt) {
    this.binds.preUpdate(dt);
  }

  onDeath(entity) {
    if (entity.isPlayer()) {
      const { id } = entity.controller;
      this.onDeathEvents.forEach(event => {
        const { name, action } = event;
        this.game.scoreManager.mutateScore(name, id, action);
      });
    }
    this.binds.onDeath(entity);
  }

  postUpdate(dt) {
    this.binds.postUpdate(dt);
  }

  onPlayerCreated(playerObject, circle) {
    this.binds.onPlayerCreated(playerObject, circle);
  }

  onPlayerLeave(idTag) {
    this.binds.onPlayerLeave(idTag);
  }

  onRespawn(entity) {
    this.binds.onRespawn(entity);
  }
}

export default GamemodeEventHandler;

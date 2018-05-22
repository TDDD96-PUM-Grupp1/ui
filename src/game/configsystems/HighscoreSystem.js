import ConfigSystem from './ConfigSystem';
import HighscoreList from '../HighscoreList';
import ScoreManager from '../ScoreManager';

// Enums used to configure the highscore
const enums = {
  event: {
    trigger: {
      death: Symbol('trigger.death'),
      kill: Symbol('trigger.kill'),
    },
    action: {
      reset: Symbol('action.reset'),
      increment: Symbol('action.increment'),
      decrement: Symbol('action.decrement'),
    },
  },
  order: {
    ascending: true,
    descending: false,
  },
  display: {
    time: Symbol('display.time'),
    latency: Symbol('display.latency'),
    best: name => ({ type: 'best', target: name }),
  },
};

/*
Handles the highscore
*/
class HighscoreSystem extends ConfigSystem {
  constructor(handler, options) {
    super(handler, options);
    // New gamemode, new scoremanager
    this.scoreManager = new ScoreManager();
    // Drop a reference to it in game so gamemodes can manipulate
    this.game.scoreManager = this.scoreManager;

    this.onDeathEvents = [];
    this.onKillEvents = [];

    this.advancedDisplays = [];
    this.timeDisplays = [];
  }

  setup() {
    const binds = { onPlayerLeave: true };
    if (this.options.highscore.order) {
      this.scoreManager.setAscOrder(this.options.highscore.order);
    }
    Object.keys(this.options.highscore.scores).forEach(title => {
      const score = this.options.highscore.scores[title];
      const name = title.replace(/_/g, ' ');
      const { initial, primary } = score;
      this.scoreManager.addScoreType(name, initial, primary);
    });
    this.highscoreList = new HighscoreList(this.scoreManager, this.game);

    this.setUpHighscoreEvents();

    // Only listen to preUpdate if we have any timeDisplays
    if (this.timeDisplays.length > 0) {
      binds.preUpdate = true;
    }
    // Only listen to onPlayerCreated (to setup a death listener) if we have any deathEvents
    if (this.onDeathEvents.length > 0) {
      binds.onPlayerCreated = true;
    }
    // Only listen to postUpdate if we have any advanced displays
    if (this.advancedDisplays.length > 0) {
      binds.postUpdate = true;
    }

    return binds;
  }

  clean() {
    this.highscoreList.clean();
  }

  attachHooks() {
    // If we have any kill events then attach to the kill hook
    // so we'll get notified by the kill system
    if (this.onKillEvents.length > 0) {
      this.handler.hookUp('kill', this.onKill.bind(this));
    }
  }

  setUpHighscoreEvents() {
    // Go through the highscores in the options
    Object.keys(this.options.highscore.scores).forEach(title => {
      const highscore = this.options.highscore.scores[title];
      const name = title.replace(/_/g, ' ');
      const { initial, display, events } = highscore;
      // Check for a display type, these are scores that depend on something that is not an event
      if (display !== undefined) {
        switch (display) {
          case enums.display.time:
            this.timeDisplays.push({ name });
            break;
          case enums.display.latency:
            // Displayed through event from instance by game core.
            break;
          default:
            // The display was not one the simple ones
            if (display.type) {
              // We have an advanced display, these depend on another score
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
      // Check for events
      if (events !== undefined) {
        // Events consist of a trigger and an action and a score can have many events
        events.forEach(event => {
          const { trigger, action } = event;
          let actionFunc;
          // The action is a simple function that receives the score
          // and returns the new value of the score
          switch (action) {
            case enums.event.action.reset:
              actionFunc = () => initial;
              break;
            case enums.event.action.increment:
              actionFunc = n => n + 1;
              break;
            case enums.event.action.decrement:
              actionFunc = n => n - 1;
              break;
            default:
              throw new Error(`Invalid event action '${action}'.`);
          }
          // Triggers are well defined events that mostly occur due to other systems
          switch (trigger) {
            case enums.event.trigger.death:
              this.onDeathEvents.push({ name, action: actionFunc });
              break;
            case enums.event.trigger.kill:
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
    // For every time display if the player is alive we add the time delta to their score
    this.timeDisplays.forEach(display => {
      const { name } = display;
      this.game.entityHandler.getPlayers().forEach(entity => {
        if (!entity.isDead) {
          const { id } = entity.controller;
          this.scoreManager.addScore(name, id, dt);
        }
      });
    });
  }

  postUpdate() {
    const players = Object.keys(this.handler.players);
    // Check the conditionals for the advanced displays and update if they succeed
    this.advancedDisplays.forEach(display => {
      // Prettier wants this line on 1 row but eslint wants it spread out...
      // eslint-disable-next-line
      const { name, target, cond, update } = display;
      players.forEach(id => {
        const current = this.scoreManager.getScore(name, id);
        const score = this.scoreManager.getScore(target, id);
        if (cond(current, score)) {
          this.scoreManager.setScore(name, id, update(current, score));
        }
      });
    });
  }

  onPlayerCreated(playerObject, circle) {
    // Add player to the scoremanager to track their scores
    this.scoreManager.addPlayer(playerObject);
    // Attach a death listener for the death events
    circle.addDeathListener(this.onDeath.bind(this));
  }

  onDeath(entity) {
    // Don't try to update scores for a player that has left
    if (!entity.playerLeft) {
      const { id } = entity.controller;
      // Perform the action of all death events
      this.onDeathEvents.forEach(event => {
        const { name, action } = event;
        this.scoreManager.mutateScore(name, id, action);
      });
    }
  }

  onPlayerLeave(id) {
    this.scoreManager.removePlayer(id);
  }

  // Called by the 'kill' hook from the kill system
  onKill(params) {
    const { killer } = params;
    // Perform the action of all kill events
    this.onKillEvents.forEach(event => {
      const { name, action } = event;
      this.scoreManager.mutateScore(name, killer, action);
    });
  }
}

export default HighscoreSystem;
// Lets you import the highscore enums without importing the class
// by doing `import {HighscoreEnums} from './HighscoreSystem`
export { enums as HighscoreEnums };

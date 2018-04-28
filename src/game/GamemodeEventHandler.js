class GamemodeEventHandler {
  constructor(game, gamemode, options) {
    this.game = game;
    this.binds = {};
    this.gamemode = gamemode;
    this.options = options;
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
    this.onRespawn(entity);
  }
}

export default GamemodeEventHandler;

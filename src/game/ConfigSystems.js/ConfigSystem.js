class ConfigSystem {
  constructor(handler, options) {
    this.game = handler.game;
    this.gamemode = handler.gamemode;
    this.handler = handler;
    this.options = options;
  }

  /* eslint-disable */
  setup(options) {}

  preUpdate(dt) {}

  postUpdate(dt) {}

  onPlayerJoin(playerObject) {}

  onPlayerCreated(playerObject, circle) {}

  onPlayerLeave(idTag) {}

  onButtonPressed(id, button) {}
  /* eslint-enable */
}
export default ConfigSystem;

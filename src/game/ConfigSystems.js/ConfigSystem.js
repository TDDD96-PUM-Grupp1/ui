class ConfigSystem {
  constructor(handler, config) {
    this.handler = handler;
    this.config = config;
  }

  /* eslint-disable */
  preUpdate(dt) {}

  postUpdate(dt) {}

  onPlayerJoin(playerObject) {}

  onPlayerCreated(playerObject, circle) {}

  onPlayerLeave(idTag) {}

  onButtonPressed(id, button) {}
  /* eslint-enable */
}
export default ConfigSystem;

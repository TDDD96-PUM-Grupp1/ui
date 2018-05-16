/*
Data model for a gamemodes resources and config.
*/
class GamemodeConfig {
  constructor(name, resources = [], options = {}) {
    this.name = name;
    this.resources = resources;
    this.options = options;
  }
}

export default GamemodeConfig;

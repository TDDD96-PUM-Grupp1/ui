/*
Data model for a gamemodes resources and config.
*/
class GamemodeConfig {
  constructor(list, name, resources = [], options = {}, extending = []) {
    this.name = name;
    this.resources = resources;
    this.options = options;
    this.extending = extending;
    extending.forEach(gamemode => {
      this.extend(list.getConfig(gamemode));
    });
  }

  // Copy a gamemodes config to this one
  extend(config) {
    // Copy over their resources
    config.resources.forEach(resource => {
      this.resources.push(resource);
    });
    // Copy their config options. Don't override already defined options.
    Object.keys(config.options).forEach(option => {
      if (this.options[option] === undefined) {
        this.options[option] = config.options[option];
      }
    });
  }
}

export default GamemodeConfig;

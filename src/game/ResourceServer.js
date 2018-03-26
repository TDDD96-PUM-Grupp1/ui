import * as PIXI from 'pixi.js';

/*
  Handles loading of resources
*/
class ResourceServer {
  constructor() {
    this.resourceDir = 'resources/';
    this.loader = PIXI.loader;
  }

  /*
    Takes a list of resources to load and return a promise
    Resourcelist should have the format:
    [{"name1", "path/to/res1"}, {"name2", "path/to/res2"}, .. {"namen", "path/to/resn"}]
  */
  requestResources(resourceList) {
    for (let i = 0; i < resourceList.length; i += 1) {
      const resource = resourceList[i];
      const path = this.resourceDir + resource.path;
      this.loader.add(resource.name, path);
    }

    const resources = {};

    // Create promise
    const p = new Promise((resolve, reject) => {
      // Perform load
      this.loader.load((loader, result) => {
        const resNames = Object.keys(result);
        let errorFree = true;

        let name;
        let resError;
        let resTexture = {};

        for (let i = 0; i < resNames.length && errorFree; i += 1) {
          name = resNames[i];
          resTexture = result[name].texture;
          resError = result[name].error;

          if (resError != null) {
            // Error loading resource
            errorFree = false;
            reject(new Error(`Failed to load resource ${name} from path ${result[name].url}`));
          } else {
            // Loading successful
            resources[name] = resTexture;
          }
        }

        if (errorFree) {
          resolve(resources);
        }
      });
    });

    return p;
  }
}

export default ResourceServer;

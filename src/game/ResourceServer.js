import * as PIXI from 'pixi.js';

/*
  Handles loading of resources
*/
class ResourceServer {
  constructor() {
    this.resourceDir = '../resources';
    this.loader = PIXI.loader;
  }

  /*
    Takes a list of resources to load and return a promise
    Resourcelist should have the format:
    [{"name1", "path/to/res1"}, {"name2", "path/to/res2"}, .. {"namen", "path/to/resn"}]
  */
  requestResources(resourceList, doneFunc) {
    for (let i = 0; i < resourceList.length; i += 1) {
      const resource = resourceList[i];
      this.loader.add(resource.name, this.resourceDir + resource.path);
    }

    const resources = {};

    // Perform load
    this.loader.load((loader, result) => {
      console.log('Result');
      console.log(result);

      const resNames = Object.keys(result);
      let name = '';
      let resTexture = {};

      for (let i = 0; i < resNames.length; i += 1) {
        name = resNames[i];
        resTexture = result[name].texture;

        // TODO handle errors from resources that fail to load
        resources[name] = new PIXI.TilingSprite(resTexture);
      }

      doneFunc(resources);
    });
  }
}

export default ResourceServer;

/*
Configuration file for different project parameters.
*/

const settings = {
  skipmenu: true,
  defaultGamemode: 'Hockey',
  game: {
    localPlayer: true,
    testLeave: false,
    testRejoin: false,
    testMove: false,
    forceCanvas: true,
    antialias: false,
    scaleUI: false,
  },
  communication: {
    pingrate: 1,
    timeout_count: 5,
    service_name: 'gameclient',
    auth: {
      id: 'gameclient',
      password: '6da9475cfe8525232dfb42b293f56acea8333e4ee7ea56d961d9dbfe4d2ea324',
    },
  },
};

export default settings;

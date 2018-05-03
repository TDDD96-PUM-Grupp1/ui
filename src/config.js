/*
Configuration file for different project parameters.
*/

const settings = {
  skipmenu: false,
  defaultGamemode: 'Dodgebot',
  game: {
    localPlayer: false,
    testLeave: false,
    testRejoin: false,
    testMove: false,
    forceCanvas: true,
    antialias: false,
  },
  communication: {
    pingrate: 1,
    timeout_count: 5,
    service_name: 'tddd96client',
    auth: {
      id: 'tddd96client',
      password: '6da9475cfe8525232dfb42b293f56acea8333e4ee7ea56d961d9dbfe4d2ea324',
    },
  },
};

export default settings;

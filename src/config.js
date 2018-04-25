/*
Configuration file for different project parameters.
*/

const settings = {
  skipmenu: false,
  defaultGamemode: 'dodgebot',
  game: {
    localPlayer: false,
    forceCanvas: true,
    antialias: false,
  },
  communication: {
    host_ip: 'ds.tddd96.i4demo.com:80',
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

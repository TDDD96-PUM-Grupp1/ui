import React from 'react';
import ReactDOM from 'react-dom';
import WebFontLoader from 'webfontloader';

import './css/reset.css';
import './css/index.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Font Loading
WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';

import './css/reset.css';
import './css/index.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

// Font Loading
WebFont.load({
  google: {
    families: ['Amatic SC', 'Roboto'],
  },
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

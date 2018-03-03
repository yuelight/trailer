import React from 'react';
import { render } from 'react-dom';
import App from './app';
import 'dplayer/dist/DPlayer.min.css';
import 'dplayer/dist/DPlayer.min.js';

const rootElement = document.querySelector('#app');

render(<App />, rootElement);

if (module.hot) {
	module.hot.accept();
}

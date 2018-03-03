import React from 'react';
import { render } from 'react-dom';
import App from './app';

const rootElement = document.querySelector('#app');

render(<App />, rootElement);

if (module.hot) {
	module.hot.accept();
}

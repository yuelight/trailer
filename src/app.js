import React from 'react';
import {
	Route,
	HashRouter,
	Link
} from 'react-router-dom';
import routes from './routes';
import 'antd/dist/antd.css';
import 'assets/common.sass';

export default () => (
	<HashRouter>
		<div style={{height: '100%'}}>
			{
				routes.map(({ name, path, exact = true, component }) => (
					<Route path={path} exact={exact} component={component} key={name} />
				))
			}
		</div>
	</HashRouter>
);

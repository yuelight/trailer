import Koa from 'koa';
const app = new Koa();
import views from 'koa-views';
import { Route } from 'koa-decorators-router';
import json from 'koa-json';
import onerror from 'koa-onerror';
import bodyparser from 'koa-bodyparser';
import session from 'koa-session';
import logger from 'koa-logger';
import middleware from 'koa-webpack';
import config from '../../webpack.config';
import Db from './mongo';

const router = new Route({
	app,
	apiDirPath: `${__dirname}/../app/controller`
});

const db = new Db();
db.init();

app.keys = ['triler'];
const CONFIG = {
	key: 'koa:sess',
	maxAge: 86400000,
	overwrite: true,
	httpOnly: false,
	signed: true,
	rolling: false,
	renew: false
};

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
	enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(session(CONFIG, app));
app.use(logger());
app.use(require('koa-static')(__dirname + '/../public'));

app.use(views(__dirname + '/../app/views', {
	extension: 'pug'
}));

app.use(middleware({
	config,
	dev: {
		publicPath: '/',
		logLevel: 'error'
	},
	hot: {
		hot: true,
		reload: true,
		logLevel: 'silent'
	}
}));

// logger
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
router.registerRouters();

// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx);
});

export default app;

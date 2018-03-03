import Koa from 'koa';
const app = new Koa();
import views from 'koa-views';
import DecRouter from 'koa-dec-router';
import json from 'koa-json';
import onerror from 'koa-onerror';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import glob from 'glob';

const decRouter = DecRouter({
	controllersDir: `${__dirname}/../app/controller`
});

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
	enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/../public'));

app.use(views(__dirname + '/../app/views', {
	extension: 'pug'
}));

// logger
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(decRouter.router.routes(), decRouter.router.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx);
});

export default app;

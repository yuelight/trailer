import { convert } from 'koa-decorators-router';
import R from 'ramda';


export const auth = convert(async (ctx, next) => {
	if (!ctx.session.user)
		ctx.body = {
			success: false,
			code: 401,
			err: '登录信息失效，重新登录'
		};
	await next();
});

export const admin = roleExpected => convert(async (ctx, next) => {
	const user = {
		admin: 10,
		superAdmin: 100
	};
	const { role } = ctx.session.user;

	if (!role || role < user[roleExpected])
		ctx.body = {
			success: false,
			code: 403,
			err: '你没有权限，来错地方了'
		};
	await next();
});

export const required = rules => convert(async (ctx, next) => {
	let errors = [];

	const checkRules = R.forEachObjIndexed(
		(value, key) => {
			errors = R.filter(i => {
				return !R.has(i, ctx.request[key]);
			})(value);
		}
	);

	checkRules(rules);

	if (errors.length)
		ctx.body = {
			success: false,
			code: 412,
			err: `${errors.join(',')} is required`
		};
	await next();
});

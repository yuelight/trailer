import {
	controller,
	get,
	post
} from 'koa-dec-router';

@controller('')
export default class IndexController {
	@get('/')
	async r_index(ctx, next) {
		await ctx.render('index', {
			title: 'Hello Koa 2!'
		});
	}
	@get('/string')
	async r_string(ctx, next) {
		ctx.body = 'koa2 string';
	}
	@get('/json')
	async r_json(ctx, next) {
		ctx.body = {
			title: 'koa2 json'
		};
	}
}

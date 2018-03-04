import {
	controller,
	get,
	post,
	del
} from 'koa-decorators-router';

import { checkPassword } from '../../base/services/user';
import { getAllMovies, findAndRemove } from '../../base/services/movie';
import { auth, admin, required } from '../../base/middleware';

@controller('/admin')
export default class AdminController {
	@get('/movie/list')
	@auth
	@admin('admin')
	async r_movies(ctx, next) {
		const movies = await getAllMovies();

		ctx.body = {
			success: true,
			data: movies
		};
	}

	@del('/movie')
	@required({
		query: ['id']
	})
	async r_del_movie(ctx, next) {
		const id = ctx.query.id;
		const movie = await findAndRemove(id);
		const movies = await getAllMovies();

		ctx.body = {
			data: movies,
			success: true
		};
	}

	@post('/login')
	@required({
		body: ['email', 'password']
	})
	async r_login(ctx, next) {
		const { email, password } = ctx.request.body;
		const matchData = await checkPassword(email, password);
		const reply = {
			success: false,
			err: '密码不正确'
		};

		if (!matchData.user) {
			reply.err = '用户不存在';
		}

		if (matchData.match) {
			ctx.session.user = {
				_id: matchData.user._id,
				email: matchData.user.email,
				role: matchData.user.role,
				username: matchData.user.username
			};

			reply.success = true;
			delete reply.err;
		}

		ctx.body = reply;
	}

	@post('/logout')
	async r_logout(ctx, next) {
		if (!ctx.session.user) {
			return ctx.body = {
				success: false,
				err: 'No session exist'
			};
		}
		delete ctx.session.user;
		ctx.body = {
			success: true
		};
	}
}

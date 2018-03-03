import {
	controller,
	get,
	post
} from 'koa-dec-router';

import {
	getAllMovies,
	getMovieDetail,
	getRelativeMovies
} from '../../services/movie';

@controller('/api/v0/movies')
export default class IndexController {
	@get('/')
	async r_movies(ctx, next) {
		const { type, year } = ctx.query;
		const movies = await getAllMovies(type, year);
		ctx.body = {
			success: true,
			data: movies
		};
	}
	@get('/:id')
	async r_movie(ctx, next) {
		const id = ctx.params.id;
		const movie = await getMovieDetail(id);
		const relativeMovies = await getRelativeMovies(movie);
		ctx.body = {
			data: {
				movie,
				relativeMovies
			},
			success: true
		};
	}
}

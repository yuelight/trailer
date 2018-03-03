import mongoose from 'mongoose';
const Movie = mongoose.model('Movie');

export const getAllMovies = async (type, year) => {
	let query = {};
	if (type)
		query.movieTypes = { $in: [type] };
	if (year)
		query.year = year;

	return await Movie.find(query);
};

export const getMovieDetail = async (id) => {
	return await Movie.findOne({ _id: id });
};

export const getRelativeMovies = async (movie) => {
	return await Movie.find({
		movieTypes: {
			$in: movie.movieTypes
		}
	});
};

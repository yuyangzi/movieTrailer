const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');

export const getAllMovies = async (type, year) => {
    let query = {};

    if (type) {
        query.movieTypes = {
            $in: [type]
        }
    }

    if (year) {
        query.year = year;
    }

    const movies = await Movie.find(query);

    return movies
}

export const getMovieDetail = async (id) => {
    const movie = await Movie.findOne({
        _id: id
    });

    return movie;
}

export const getRelativeMovies = async (movie) => {
    const movies = await Movie.find({
        movieTypes: {
            // $in 接受一个数组作为参数.返回数值中符合条件的所有数据
            $in: movie.movieTypes
        }
    });

    return movies;
}

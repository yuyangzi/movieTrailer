import {
    getAllMovies,
    getMovieDetail,
    getRelativeMovies
} from '../service/movie';

// 导入路由模块
const Router = require('koa-router');
// 导入mongoose
const mongoose = require('mongoose');
const {
    controller,
    get,
    post,
    put,
    del
} = require('../lib/decorator');


@controller('/api/v0/movies')
export class MoviesController {
    @get('/')
    async getMovies(ctx, next) {

        const {
            type,
            year
        } = ctx.query;

        const movies = await getAllMovies(type, year);

        ctx.body = {
            movies
        };
    }

    @get('/:id')
    async getMoviesDetail(ctx, next) {
        const id = ctx.params.id;
        const movie = await getMovieDetail(id);
        const relativeMovies = await getRelativeMovies(movie);

        ctx.body = {
            data: {
                movie,
                relativeMovies,
            },
            code: 0,
            message: '',
        };
    }
}

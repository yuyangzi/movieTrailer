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
        // 获取MovieSchema
        const Movie = mongoose.model('Movie');
        const movies = await Movie.find({}).sort({
            'meta.createdAt': -1
        });

        ctx.body = {
            movies
        };
    }

    @get('/:id')
    async getMoviesDetail(ctx, next) {
        console.log('/movies/detail/');
        // 获取MovieSchema
        const Movie = mongoose.model('Movie');
        const id = ctx.params.id;
        const movie = await Movie.findOne({
            _id: id
        });
        ctx.body = {
            movie
        };
    }
}

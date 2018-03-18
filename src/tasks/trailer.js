// 导入nodeJS 子进程模块
const childProces = require('child_process');

const path = require('path');

// 导入mongoose
const mongoose = require('mongoose');

// 获取Movie集合
const Movie = mongoose.model('Movie');

// 获取Category集合
const Category = mongoose.model('Category');

(async () => {

    // 从movie集合中拿到指定的数据
    const movies = await Movie.find({
        $or: [
            // $exists 表示此字段没有
            {
                video: {
                    $exists: false,
                },
            },
            {
                video: null
            },
            {
                video: ''
            },
        ]
    });

    // 拿到video爬虫脚本
    const script = path.resolve(__dirname, '../crawler/video.js');
    // 创建一个子进程并调用video脚本
    const child = childProces.fork(script, []);
    let invoked = false;

    // 监听子进程的error事件
    child.on('error', error => {
        if (invoked) return;
        invoked = true;
        console.log(error);

    });

    // 监听子进程的exit事件
    child.on('exit', code => {
        if (invoked) return;
        invoked = false;
        const error = code === 0 ? null : new Error('exit code' + code);
        console.log(error);
    });

    // 监听子进程的message事件
    child.on('message', async data => {
        const {
            movieId
        } = data;
        const movie = await Movie.findOne({
            movieId,
        });

        if (data.video) {
            movie.video = data.video;
            movie.cover = data.cover;
            // movie.poster = data.poster;
            movie.save();
        } else {
            // 如果电影没有预告片则删除此条电影,同时删除Category集合中的指向
            const movieType = movie.movieTypes;
            for (let i = 0; i < movieType.length; i++) {
                const type = movieType[i];

                const category = Category.findOne({
                    name: type,
                });

                if (category && category.movies) {
                    const index = category.movies.indexOf(movie._id);
                    if (index > -1) {
                        category.movies = category.movies.splice(index, 1);
                    }
                    await category.save();
                }

            }

            await movie.remove();
        }
    });
    child.send(movies);
})();

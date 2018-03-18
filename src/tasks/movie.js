// 导入nodeJS 子进程模块
const childProces = require('child_process');
const path = require('path');

// 导入mongoose
const mongoose = require('mongoose');

// 获取MovieSchema
const Movie = mongoose.model('Movie');

(async () => {
    const script = path.resolve(__dirname, '../crawler/trailer-list.js');

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
    child.on('message', data => {
        let result = data.result;
        result.forEach(async item => {
            // find()和findOne()的用法是一样的,只是返回的不同而已。
            // findOne()会返回符合条件的第一个文档，而find()会返回所有符合条件的对象。
            // findOne()返回的是一个对象，而find()返回的是一个数组，数组里面装着对象。
            let movie = await Movie.findOne({
                movieId: item.movieId,
            });

            if (!movie) {
                movie = new Movie(item);
                // 保存数据
                await movie.save();
            }
        });
    });


})();

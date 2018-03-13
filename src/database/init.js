const mongoose = require('mongoose');

const db = 'mongodb://localhost/moveTrailer';

// 将node全局变量Promise赋值给mongoose.Promise
mongoose.Promise = global.Promise;

module.exports = () => {

    let maxConnectTimes = 0;

    return new Promise((resolve, reject) => {
        // 如果node是在开发环境下则启用MongoDB的debug
        if (process.env.NODE_ENV === 'production') {
            mongoose.set('debug', true);
        }

        mongoose.connect(db);

        // 拿到mongoose的实例对象
        const mongodb = mongoose.connection;

        // 监听mongoDB的断开事件
        mongodb.on('disconnected', () => {
            maxConnectTimes++;
            if (maxConnectTimes < 5) {
                mongoose.connect(db);
            } else {
                throw Error('数据库无法连接成功');
            }
        });

        // 监听mongoDB的报错事件
        mongodb.on('error', (error) => {
            console.log(error);
            reject();
        });

        // 监听mongoDB的打开事件
        mongodb.once('open', () => {
            // const Dog = mongoose.model('Dog', {name: String});

            // const doga = new Dog({name: '阿法尔'});

            // doga.save().then(() => {
            //     console.log('OK');
            // });

            console.log('MongoDB Connected succesfully!');
            resolve();
        });
    });
};

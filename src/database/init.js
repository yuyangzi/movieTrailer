const mongoose = require('mongoose');
const db = 'mongodb://localhost/moveTrailer';

const glob = require('glob');

const path = require('path');

// 将node全局变量Promise赋值给mongoose.Promise
mongoose.Promise = global.Promise;

const connect = () => {

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
            console.log('MongoDB Connected succesfully!');
            resolve();
        });
    });
};

const initSchema = () => {
    glob.sync(path.resolve(__dirname, './schema', '**/*.js')).forEach(require);
};

module.exports = {
    connect,
    initSchema,
};

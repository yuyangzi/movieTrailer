const path = require('path');
const Koa = require('koa');
// 导入koa-views中间件, 管理模板引擎
const koaViews = require('koa-views');

const {
    connect,
    initSchema,
    initAdmin
} = require('./database/init');

// 导入ramda库
const R = require('ramda');

const MIDDLEWARES = ['router'];

// // 导入路由模块
// const {
//     router
// } = require();


const useMiddlewares = (app) => {
    R.map(
        R.compose(
            R.forEachObjIndexed(initWith => initWith(app)),
            require,
            name => path.resolve(__dirname, `./middlewares/${name}`),
        )
    )(MIDDLEWARES)
}

(async () => {
    await connect();
    initSchema();
    await initAdmin();
    // require('./tasks/movie');
    // require('./tasks/api');
    // require('./tasks/trailer');
    // require('./tasks/qiniu');

    // new 一个Koa实例
    const app = new Koa();

    await useMiddlewares(app);

    // 指定端口
    app.listen(4800);
})();

const path = require('path');
const Koa = require('koa');
// 导入koa-views中间件, 管理模板引擎
const koaViews = require('koa-views');

const {connect, initSchema, initAdmin} = require('./database/init');

(async () => {
    await connect();
    initSchema();
    await initAdmin();

    // require('./tasks/movie');
    // require('./tasks/api');
    // require('./tasks/trailer');
    // require('./tasks/qiniu');
})();

// new 一个Koa实例
const app = new Koa();

app.use(koaViews(path.resolve(__dirname, './views'), {
    extension: 'pug',
}));

app.use(async (ctx) => {
    await ctx.render('index', {
        you: '李白',
        me: '王宜明'
    });
});

// 指定端口
app.listen(4800);

const Koa = require('koa');

// new 一个Koa实例
const app = new Koa();

app.use(async (ctx) => {
    ctx.body = '电影预告';
});

// 指定端口
app.listen(4800);
const Koa = require('koa');

// 导入模板文件
const {normal} = require('../template/index');

// new 一个Koa实例
const app = new Koa();

app.use(async (ctx) => {
    ctx.type = 'text/html;';
    ctx.body = normal;
});

// 指定端口
app.listen(4800);
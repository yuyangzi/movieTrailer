// 导入nodeJS 子进程模块
const childProces = require('child_process');

const path = require('path');

(async () => {
    const script = path.resolve(__dirname, '../crawler/video.js');

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
        // https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2512926776.jpg
        console.log(data);
    });


})();

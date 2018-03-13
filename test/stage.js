const {readFile} = require('fs');

const EventEmitter = require('events');

class EE extends EventEmitter {}

const yy = new EE();

yy.on('event', () => {
    console.log('出大事了');
});

setTimeout(() => {
    console.log('0 毫秒到期后执行到期回调');
}, 0);

setTimeout(() => {
    console.log('100 毫秒到期后执行到期回调');
}, 100);

setTimeout(() => {
    console.log('200 毫秒到期后执行到期回调');
}, 200);

readFile('./package.json', 'utf-8', () => {
    console.log('完成文件操作 1 读的回调');
});

readFile('./README.md', 'utf-8', () => {
    console.log('完成文件操作 2 读的回调');
});

setImmediate(() => {
    console.log('immediate 立即回调');
});

process.nextTick(() => {
    console.log('process.nextTick 的第一次回调');
});

Promise.resolve()
    .then(() => {
        yy.emit('event');
        process.nextTick(() => {
            console.log('process.nextTick 的地二次回调');
        });

        console.log('promise 的第一次回调');
    })
    .then(() => {
        console.log('promise 的第二次回调');
    });

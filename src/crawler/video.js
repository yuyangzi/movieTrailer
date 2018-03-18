const puppeteer = require('puppeteer');

const url = 'https://movie.douban.com/subject/';

// const doubanId = '3078549';

// 延时函数
const sleep = time => new Promise(resolve => {
    resolve(setTimeout(() => {}, time));
});

process.on('message', async movies => {
    console.log('Start visit the target page');
    // 创建一个浏览器
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false,
        headless: false
    });

    // 新建一个页面
    const page = await browser.newPage();

    for (let i = 0; i < movies.length; i++) {
        const movieId = movies[i].movieId;

        await page.goto(url + movieId + '/', {
            waitUntil: 'networkidle2',
        });

        sleep(1000);

        // 将要在页面中执行的JavaScript代码
        const result = await page.evaluate(() => {
            const $ = window.$;

            const it = $('.related-pic-video');

            if (it && it.length) {
                const link = it.attr('href');
                const cover = it.find('img').attr('src');
                return {
                    link,
                    cover
                };
            }

            return {};
        });

        let video;
        if (result.link) {
            await page.goto(result.link, {
                waitUntil: 'networkidle2',
            });
            sleep(2000);

            video = await page.evaluate(() => {
                const $ = window.$;

                const source = $('source');

                if (source && source.length > 0) {
                    return source.attr('src');
                }

                return '';
            });
        }

        const data = {
            video,
            movieId,
            cover: result.cover
        };

        process.send(data);
    }
    browser.close();
    process.exit(0);

});

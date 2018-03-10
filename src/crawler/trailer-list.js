const puppeteer = require('puppeteer');

const url = 'https://movie.douban.com/tag/#/?sort=R&range=6,10&tags=';

// 延时函数
const sleep = time => new Promise(resolve => {
    resolve(setTimeout(() => {}, time));
});

(async () => {
    console.log('Start visit the target page');

    // 创建一个浏览器
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false,
    });

    // 新建一个页面
    const page = await browser.newPage();

    await page.goto(url, {
        waitUntil: 'networkidle2',
    });

    await sleep(3000);

    // 等待一个元素出现 -- '加载更多'按钮
    await  page.waitForSelector('.more');

    for (let i = 0; i < 1; i++) {
        await sleep(3000);
        // 用于搜索元素以进行单击。如果有多个元素满足选择器，则第一个会被点击。
        await page.click('.more');
    }

    // 将要在页面中执行的JavaScript代码
    const result = await page.evaluate(() => {
        const $ = window.$;
        const items = $('.list-wp a');
        const links = [];

        console.log(items);

        if (items.length > 0) {
            items.each((index, item) => {
                let it = $(item);
                let movieId = it.find('div').data('id');
                let title = it.find('.title').text();
                let rate = Number(it.find('.rate').text());
                let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio');

                links.push({
                    movieId,
                    title,
                    rate,
                    poster
                });
            });
        }

        return links;
    });

    browser.close();

    // console.log(result);
    process.send({result});
    process.exit(0);

})();

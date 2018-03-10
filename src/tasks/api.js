const rp = require('request-promise-native');

async function fetchMove(item) {
    const url = `http://api.douban.com/v2/movie/subject/${item.movieId}`;
    const result = await rp(url);
    return result;
}

(async () => {
    const moves = [
        {
            movieId: 27145036,
            title: '神探斯特莱克 第二季',
            rate: 7.4,
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2513223253.jpg'
        },
        {
            movieId: 26984529,
            title: '单恋大作战',
            rate: 7.1,
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2512926776.jpg'
        },
        {
            movieId: 26891592,
            title: '鬼玩人 第三季',
            rate: 9.4,
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2511166502.jpg'
        },
        {
            movieId: 27168183,
            title: '灵契 第二季',
            rate: 8.3,
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2508377874.jpg'
        }
    ];

    moves.map(async move => {
        let moveData = await fetchMove(move);
        try {
            moveData = JSON.parse(moveData);
            console.log(moveData.summary);
        } catch (error) {
            console.log(error);
        }
    });
})();

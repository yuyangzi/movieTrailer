// 导入七牛官方模块
const qiniu = require('qiniu');

// 导入nanoid模块
const nanoid = require('nanoid');

// 导入配置文件
const config = require('../config/index');


const bucket = config.qiniu.bucket;

const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK);

const cfg = new qiniu.conf.Config();

const client = new qiniu.rs.BucketManager(mac, cfg);

const uploadToQiniu = async (url, key) => {
    return new Promise((resolve, reject) => {
        client.fetch(url, bucket, key, (err, ret, info) => {
            if (err) {
                reject(err);
            } else {
                if (info.statusCode === 200) {
                    resolve({
                        key
                    });
                } else {
                    reject(info);
                }
            }
        });
    });
};

(async () => {
    const moves = [{
        video: 'http://vt1.doubanio.com/201803122129/7430aef5ac82f772d16980c4d83615e6/view/movie/M/302250688.mp4',
        doubanId: '3078549',
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2509632710.jpg',
        cover: 'https://img3.doubanio.com/img/trailer/medium/2509585732.jpg?'
    }];

    moves.map(async move => {
        if (move.video && !move.key) {
            try {
                let videData = await uploadToQiniu(move.video, nanoid() + '.mp4');
                let coverData = await uploadToQiniu(move.cover, nanoid() + '.png');
                let posterData = await uploadToQiniu(move.poster, nanoid() + '.png');


                if (videData.key) {
                    move.videoKey = videData.key;
                }

                if (coverData.key) {
                    move.coverKey = coverData.key;
                }

                if (posterData.key) {
                    move.posterKey = posterData.key;
                }
                console.log(move);
            } catch (err) {
                console.log(err);
            }
        }
    });

})();

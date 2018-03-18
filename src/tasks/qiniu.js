// 导入七牛官方模块
const qiniu = require('qiniu');

// 导入nanoid模块
const nanoid = require('nanoid');

// 导入配置文件
const config = require('../config/index');

// 导入mongoose
const mongoose = require('mongoose');

// 获取Movie集合
const Movie = mongoose.model('Movie');

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
    const moves = await Movie.find({
        $or: [
            {
                videoKey: {
                    $exists: false
                }
            },
            {
                videoKey: null
            },
            {
                videoKey: ''
            },
        ]
    });

    for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        if (move.video && !move.videoKey) {
            try {
                console.log('开始上传video');
                let videData = await uploadToQiniu(move.video, nanoid() + '.mp4');
                console.log('开始上传cover');
                let coverData = await uploadToQiniu(move.cover, nanoid() + '.png');
                // console.log('开始上传poster');
                // let posterData = await uploadToQiniu(move.poster, nanoid() + '.png');

                if (videData.key) move.videoKey = videData.key;
                if (coverData.key) move.coverKey = coverData.key;
                // if (posterData.key) move.posterKey = posterData.key;
                await move.save();
            } catch (err) {
                console.log(err);
            }
        }
    }
})();

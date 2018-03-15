// 导入mongoose模块
const mongoose = require('mongoose');

// 拿到Schema构造函数.用以构建Schema
const Schema = mongoose.Schema;

// Mixed类型代表可以存储任何类型的数据
const {
    Mixed,
    ObjectId
} = Schema.Types;

// 创建move模型
const MoveSchema = new Schema({
    // 电影ID
    moveId: {
        type: String,
        unique: true,
    },
    movies: {
        type: ObjectId,
        ref: 'Category'
    },
    // 评分
    rate: Number,
    // 标题
    title: String,
    // 简介
    summary: String,
    // 视频
    video: String,
    // 海报图
    poster: String,
    // 封面图
    cover: String,
    // 图床上的地址
    videoKey: String,
    // 图床上的地址
    posterKey: String,
    // 图床上的地址
    coverKey: String,
    // 原始标题
    rawTitle: String,
    // 电影类型
    moveTypes: [String],
    // 上映日期
    pubdate: Mixed,
    // 上映年份
    year: Number,
    // 电影标签
    tags: [String],
    meta: {
        // 数据创建时间
        createAt: {
            type: Date,
            default: Date.now()
        },
        // 数据更新时间
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

// 在存储数据之前调用的函数
MoveSchema.pre('save', next => {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

mongoose.model('Movie', MoveSchema);

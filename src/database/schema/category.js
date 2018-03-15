// 导入mongoose模块
const mongoose = require('mongoose');

// 拿到Schema构造函数.用以构建Schema
const Schema = mongoose.Schema;

// Mixed类型代表可以存储任何类型的数据
const ObjectId = Schema.Types.ObjectId;

// 创建move模型
const CategorySchema = new Schema({

    name: {
        unique: true,
        type: String,
    },
    movies: [{
        type: ObjectId,
        ref: 'Movie'
    }],
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
CategorySchema.pre('save', next => {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

mongoose.model('Category', CategorySchema);

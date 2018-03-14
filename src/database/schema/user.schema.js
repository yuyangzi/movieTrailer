// 导入mongoose模块
const mongoose = require('mongoose');

// 将数据加盐的库
const bcrypt = require('bcrypt');

// 数据的加盐等级
const SALT_WORK_FACTOR = 10;

// 用户错误登录的最大次数
const MAX_LOGIN_ATTEMPTS = 5;

// 锁定时间
const LOCK_TIME = 2 * 60 * 60 * 1000;

// 拿到Schema构造函数.用以构建Schema
const Schema = mongoose.Schema;

// // Mixed类型代表可以存储任何类型的数据
// const Mixed = Schema.Types.Mixed;

// 创建move模型
const userSchema = new Schema({
    userName: {
        // 表示该字段不允许重复
        unique: true,
        // 表示必填字段
        required: true,
        type: String,
    },
    email: {
        unique: true,
        required: true,
        type: String,
    },
    password: {
        unique: true,
        required: true,
        type: String,
    },
    // 锁住的到期时间
    lockUntil: Number,
    // 密码错误登录次数
    loginAttempts: {
        type: Number,
        required: true,
        default: 0,
    },
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

// 新增虚拟字段
userSchema.virtual('isLocked').get(() => {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// 在存储数据之前调用的函数
userSchema.pre('save', next => {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    next();
});

userSchema.pre('save', next => {
    if (!this.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) return next(err);
            this.password = hash;
            next();
        });
    });
});

userSchema.methods = {
    // 比较用户输入的密码与数据库保存的密码是否一致
    comparePassword: (_password, password) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(_password, password, (err, isMatch) => {
                if (err) reject(err);
                resolve(isMatch);
            });
        });
    },

    incLoginAttempts: () => {
        return new Promise((resolve, reject) => {
            if (this.lockUntil && this.lockUntil < Date.now()) {
                this.update({
                    $set: {
                        loginAttempts: 1
                    },
                    $unset: {
                        lockUntil: 1,
                    }
                }, (err) => {
                    if (err) reject(err);
                    resolve();
                });
            } else {
                let updates = {
                    $inc: {
                        loginAttempts: 1,
                    }
                };

                if (this.loginAttempts + 1 > MAX_LOGIN_ATTEMPTS && !this.lockUntil) {
                    updates.$set = {
                        lockUntil: Date.now() + LOCK_TIME,
                    };
                }

                this.update(updates, (err) => {
                    if (err) reject(err);
                    resolve();
                });
            }
        });
    }
};

mongoose.model('User', userSchema);

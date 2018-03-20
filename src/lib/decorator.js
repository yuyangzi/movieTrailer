const Router = require('koa-router');
const glob = require('glob');
const _ = require('lodash');
const path = require('path');

const symbolPrefix = Symbol('prefix');
const routerMap = new Map();

class Route {
    constructor(app, apiPath) {
        this.app = app;
        this.apiPath = apiPath;
        this.router = new Router();
    }

    init () {
        // 拿到所有的router controller 并require入执行
        glob.sync(path.resolve(this.apiPath, './**/*.js')).forEach(require);
        // 对map对象routerMap进行for of循环并用[config, controller]进行结构解析
        for (let [config, controller] of routerMap) {
            const controllers = isArray(controller);
            // 拿到公用的前缀路径
            const prefixPath = config.target[symbolPrefix];
            // 处理前缀路径,保证路径的正确性
            if (prefixPath) prefixPath = normalizePath(prefixPath);
            // 拼接完整路径
            const routerPath = prefixPath + config.path;
            // 在koa-router 进行配置各个HTTP请求的中间件
            this.router[config.method](routerPath, ...controllers);
        }

        // 在koa 实例上注册配置好的路由实例
        this.app.use(this.router.routes());
        this.app.use(this.router.allowedMethods());
    }
}

/**
 * 判断传入的参数是不是一个人数组
 * @param {*} arr
 * @returns Array
 */
const isArray = arr => _.isArray(arr) ? arr : [arr];

/**
 * 判断所传入的路径是否以'/'作为第一个字符
 * @param {*} path 一个路径字符串
 * @returns string
 */
const normalizePath = path => path.startsWith('/') ? path : `/${path}`;

/**
 * decortaor(装饰器)
 * @param {*} config: {method, path};
 * @returns decorator
 */
const router = config => (target, key, descriptor) => {
    config.path = normalizePath(config.path);
    routerMap.set({target,...config}, target[key])
}

/**
 * decorator(装饰器)
 * @param {*} path 所装饰的路由controller的公用前缀路径
 */
const controller = path => target => {
    target.prototype[symbolPrefix] = path;
}


const get = path => router({
    method: 'get',
    path,
})

const post = path => router({
    method: 'post',
    path,
})

const put = path => router({
    method: 'put',
    path,
})

const del = path => router({
    method: 'del',
    path,
})

const use = path => router({
    method: 'use',
    path,
})

const all = path => router({
    method: 'all',
    path,
})

module.exports = {
    Route,
    controller,
    get,
    post,
    put,
    del,
    use,
    all
}

import {
    checkPassword
} from '../service/user';

const {
    controller,
    get,
    post,
    put,
    del
} = require('../lib/decorator');

@controller('/api/v0/user')
export class UserController {
    @post('/')
    async login(ctx, next) {
        const {
            email,
            password
        } = ctx.request.body;
        const matchData = await checkPassword(email, password);

        if (!matchData.user) {
            return (ctx.body = {
                code: 400,
                message: '用户不存在',
            })
        }

        if (matchData.match) {
            return (ctx.body = {
                code: '0',
                message: '登录成功'
            })
        }

        return (ctx.body = {
            code: 401,
            message: '用户或密码错误'
        })
    }
}

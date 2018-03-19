const path = require('path');
const {
    Route
} = require('../lib/decorator');


const router = app => {
    const apiPath = path.resolve(__dirname, '../routes');
    const router = new Route(app, apiPath);
    router.init();
}

module.exports = {
    router
};

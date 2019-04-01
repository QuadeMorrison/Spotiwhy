const proxy = require('http-proxy-middleware');

const defaultProxy = process.env.PROXY

module.exports = function(app) {
  app.use(proxy('/*', { target: defaultProxy }))
};

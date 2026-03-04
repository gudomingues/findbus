const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.olhovivo.sptrans.com.br',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/v2.1',
      },
      onProxyReq: function(proxyReq) {
        proxyReq.setHeader('Accept', 'application/json');
      },
    })
  );
};

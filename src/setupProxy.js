const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/nb",
    createProxyMiddleware({
      target: "https://www.yr.no",
      changeOrigin: true,
    })
  );
  app.use(
    "/assets",
    createProxyMiddleware({
      target: "https://www.yr.no",
      changeOrigin: true,
    })
  );
};

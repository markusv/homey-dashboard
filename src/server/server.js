const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");

const app = express();
const port = 80;

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

app.use(express.static("build"));
app.get("*", function (request, response) {
  response.sendFile(path.resolve("build", "index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

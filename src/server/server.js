require("dotenv").config({
  path: require("path").resolve(__dirname, "../../.env"),
});

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const { registerTemperatureRoutes } = require("./routes/temperature");

const app = express();
const port = Number(process.env.PORT) || 80;

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

registerTemperatureRoutes(app);

app.use(express.static("build"));
app.get("*", (request, response) => {
  response.sendFile(path.resolve("build", "index.html"));
});

app.listen(port, () => {
  console.log(`Homey dashboard listening on port ${port}`);
});

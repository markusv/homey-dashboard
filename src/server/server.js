import { config as loadEnv } from "dotenv";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { registerTemperatureRoutes } from "./routes/temperature.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

loadEnv({
  path: path.resolve(__dirname, "../../.env"),
});

const app = express();
const port = Number(process.env.PORT) || 80;
const buildDir = path.resolve(__dirname, "../../build");

// Optional legacy YR HTML proxy (not used by current forecast fetch).
app.use(
  "/nb",
  createProxyMiddleware({
    target: "https://www.yr.no",
    changeOrigin: true,
  })
);

registerTemperatureRoutes(app);

if (fs.existsSync(buildDir)) {
  app.use(express.static(buildDir));
  app.get("*", (request, response) => {
    response.sendFile(path.join(buildDir, "index.html"));
  });
} else {
  console.warn(
    `Build directory not found at ${buildDir}. Serving API routes only.`
  );
}

app.listen(port, () => {
  console.log(`Homey dashboard listening on port ${port}`);
});

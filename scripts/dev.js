#!/usr/bin/env node

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const serverEntry = path.join(root, "src/server/server.js");
const viteCli = path.join(root, "node_modules/vite/bin/vite.js");

const children = [];
let shuttingDown = false;

const shutdown = (code = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
  process.exit(code);
};

const run = (command, args, env = {}) => {
  const child = spawn(command, args, {
    cwd: root,
    env: { ...process.env, ...env },
    stdio: "inherit",
  });
  children.push(child);
  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    shutdown(signal ? 1 : (code ?? 1));
  });
  return child;
};

run(process.execPath, [serverEntry], { PORT: "3080" });
run(process.execPath, [viteCli, ...process.argv.slice(2)]);

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

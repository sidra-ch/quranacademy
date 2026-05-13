/* eslint-disable @typescript-eslint/no-require-imports */
const { existsSync, rmSync } = require("node:fs");
const { join } = require("node:path");

const nextDir = join(process.cwd(), ".next");

if (existsSync(nextDir)) {
  rmSync(nextDir, { recursive: true, force: true });
  console.log("[clean:next] Removed .next cache");
} else {
  console.log("[clean:next] No .next cache found");
}

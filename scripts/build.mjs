import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const output = resolve(root, "dist");

rmSync(output, { recursive: true, force: true });
mkdirSync(resolve(output, "src"), { recursive: true });

const tailwindCli = resolve(
  root,
  "node_modules/@tailwindcss/cli/dist/index.mjs",
);
const cssBuild = spawnSync(
  process.execPath,
  [tailwindCli, "-i", "src/input.css", "-o", "dist/src/output.css"],
  { cwd: root, stdio: "inherit" },
);

if (cssBuild.error) throw cssBuild.error;
if (cssBuild.status !== 0) process.exit(cssBuild.status ?? 1);

for (const file of readdirSync(root)) {
  if (file.endsWith(".html")) {
    cpSync(resolve(root, file), resolve(output, file));
  }
}

cpSync(resolve(root, "assets"), resolve(output, "assets"), {
  recursive: true,
});

const fs = require("fs/promises");
const path = require("path");

async function copyDir(source, destination) {
  await fs.cp(source, destination, { recursive: true, force: true });
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  const projectRoot = process.cwd();
  const buildDir = path.join(projectRoot, ".next");
  const contentDir = path.join(projectRoot, "content");
  const nextConfig = path.join(projectRoot, "next.config.js");

  const functionsDir = path.join(projectRoot, "functions");

  await ensureDir(functionsDir);

  // Copy Next build output for Firebase Functions runtime
  await copyDir(buildDir, path.join(functionsDir, ".next"));

  // Copy content for blog rendering
  await copyDir(contentDir, path.join(functionsDir, "content"));

  // Copy Next config used by the server
  await fs.copyFile(nextConfig, path.join(functionsDir, "next.config.js"));

  console.log("Build assets copied to functions/");
}

main().catch((error) => {
  console.error("Error copying build assets:", error);
  process.exit(1);
});

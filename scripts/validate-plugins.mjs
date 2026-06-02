import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const pluginsRoot = join(root, "plugins");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const forbiddenNames = new Set([
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".DS_Store",
  ".env",
]);

const errors = [];

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    errors.push(`${relative(root, path)} is not valid JSON: ${message}`);
    return undefined;
  }
}

function hasPluginManifest(packageJson) {
  const plugins = packageJson?.cline?.plugins;
  if (!Array.isArray(plugins) || plugins.length === 0) {
    return false;
  }
  return plugins.some((entry) => {
    if (typeof entry === "string") {
      return entry.length > 0;
    }
    return Array.isArray(entry?.paths) && entry.paths.length > 0;
  });
}

function walk(path) {
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const entryPath = join(path, entry.name);
    const rel = relative(root, entryPath);
    if (
      forbiddenNames.has(entry.name) ||
      entry.name.endsWith(".log") ||
      entry.name === ".env.local"
    ) {
      errors.push(`Forbidden artifact committed: ${rel}`);
    }
    if (entry.isDirectory()) {
      walk(entryPath);
      continue;
    }
    if (!entry.isFile()) {
      continue;
    }
    const content = readFileSync(entryPath, "utf8");
    if (content.includes("\u2014")) {
      errors.push(`Forbidden em dash in ${rel}`);
    }
    if (entry.name.endsWith(".md") && /\*\*[^*\n][\s\S]*?\*\*/.test(content)) {
      errors.push(`Forbidden markdown bold marker in ${rel}`);
    }
  }
}

if (!existsSync(pluginsRoot)) {
  errors.push("Missing plugins directory");
} else {
  for (const entry of readdirSync(pluginsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      errors.push(`plugins/${entry.name} must be a directory`);
      continue;
    }
    if (!slugPattern.test(entry.name)) {
      errors.push(`Invalid plugin slug: ${entry.name}`);
    }
    const pluginRoot = join(pluginsRoot, entry.name);
    if (!existsSync(join(pluginRoot, "README.md"))) {
      errors.push(`plugins/${entry.name} is missing README.md`);
    }
    const hasIndex = existsSync(join(pluginRoot, "index.ts"));
    const packagePath = join(pluginRoot, "package.json");
    const hasPackage = existsSync(packagePath);
    if (!hasIndex && !hasPackage) {
      errors.push(`plugins/${entry.name} needs index.ts or package.json`);
    }
    if (hasPackage) {
      const packageJson = readJson(packagePath);
      if (!hasPluginManifest(packageJson)) {
        errors.push(`plugins/${entry.name}/package.json needs cline.plugins`);
      }
    }
    if (statSync(pluginRoot).isDirectory()) {
      walk(pluginRoot);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Plugin collection validation passed.");

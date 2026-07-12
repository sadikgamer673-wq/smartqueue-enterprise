#!/usr/bin/env node
/**
 * postinstall.js - Patches for compatibility with Node v24 + pnpm monorepo
 *
 * Patches applied:
 * 1. expo-modules-core/index.js - Re-export build/index.js instead of null
 * 2. @expo/cli externals.js - Exclude colon-prefixed module IDs (node:sea etc.) from stdlib list
 * 3. webpack createHooksRegistry.js - Duck-type check instead of instanceof to allow dual-webpack pnpm variants
 * 4. @expo/cli resolveOptions.js - Read WEB_PORT env var for webpack port
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const NM = path.join(ROOT, 'node_modules');

function patch(filePath, find, replace, label) {
  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] ${label} - file not found`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(replace.slice(0, 60))) {
    console.log(`[OK]   ${label} - already patched`);
    return;
  }
  if (!content.includes(find.slice(0, 60))) {
    console.log(`[WARN] ${label} - target not found, skipping`);
    return;
  }
  content = content.replace(find, replace);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[DONE] ${label}`);
}

// 1. expo-modules-core/index.js
const emcPaths = [
  path.join(NM, 'expo-modules-core', 'index.js'),
  path.join(NM, '.pnpm', 'expo-modules-core@1.11.14', 'node_modules', 'expo-modules-core', 'index.js'),
];
for (const p of emcPaths) {
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    if (content.trim() === 'module.exports = null;') {
      fs.writeFileSync(p, "module.exports = require('./build/index.js');\n", 'utf8');
      console.log(`[DONE] expo-modules-core index.js -> ${p}`);
    } else {
      console.log(`[OK]   expo-modules-core index.js already patched -> ${p}`);
    }
  }
}

// 2. @expo/cli externals.js - exclude colon module IDs
patch(
  path.join(NM, '@expo', 'cli', 'build', 'src', 'start', 'server', 'metro', 'externals.js'),
  `.filter((x)=>!/^_|^(internal|v8|node-inspect)\\/|\\//.test(x) && ![`,
  `.filter((x)=>!/^_|^(internal|v8|node-inspect)\\/|\\//.test(x) && !x.includes(':') && ![`,
  '@expo/cli externals.js colon filter'
);

// 3. webpack createHooksRegistry.js - duck-type check (all variants)
const REGISTRY_FIND = `\t\tconst Compilation = getCompilation();\n\t\tif (!(compilation instanceof Compilation)) {\n\t\t\tthrow new TypeError(\n\t\t\t\t"The 'compilation' argument must be an instance of Compilation"\n\t\t\t);\n\t\t}`;
const REGISTRY_REPLACE = `\t\t// Duck-type check instead of instanceof to allow cross-instance Compilation\n\t\t// objects from pnpm monorepo dual-webpack peer-dep variants\n\t\tif (!compilation || typeof compilation !== "object" || !("_modules" in compilation || "modules" in compilation || "hooks" in compilation)) {\n\t\t\tthrow new TypeError(\n\t\t\t\t"The 'compilation' argument must be an instance of Compilation"\n\t\t\t);\n\t\t}`;

const webpackVariants = [
  path.join(NM, 'webpack', 'lib', 'util', 'createHooksRegistry.js'),
  path.join(NM, '.pnpm', 'webpack@5.108.3', 'node_modules', 'webpack', 'lib', 'util', 'createHooksRegistry.js'),
  path.join(NM, '.pnpm', 'webpack@5.108.3_postcss@8.5.16', 'node_modules', 'webpack', 'lib', 'util', 'createHooksRegistry.js'),
];
for (const p of webpackVariants) {
  patch(p, REGISTRY_FIND, REGISTRY_REPLACE, `webpack createHooksRegistry.js -> ${path.relative(ROOT, p)}`);
}

// 4. @expo/cli resolveOptions.js - WEB_PORT env var for webpack port
patch(
  path.join(NM, '@expo', 'cli', 'build', 'src', 'start', 'resolveOptions.js'),
  `    if (settings.webOnly) {\n        const webpackPort = await (0, _port).resolvePortAsync(projectRoot, {\n            defaultPort: options.port,\n            // Default web port\n            fallbackPort: 19006`,
  `    if (settings.webOnly) {\n        const webFallbackPort = process.env.WEB_PORT ? parseInt(process.env.WEB_PORT, 10) : 19006;\n        const webpackPort = await (0, _port).resolvePortAsync(projectRoot, {\n            defaultPort: options.port,\n            // Default web port\n            fallbackPort: webFallbackPort`,
  '@expo/cli resolveOptions.js WEB_PORT (webOnly branch)'
);

console.log('\n✅ Postinstall patches complete.');

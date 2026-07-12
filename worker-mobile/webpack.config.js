const path = require('path');
const fs = require('fs');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

// Resolve all singletons from the workspace root to prevent duplicate React instances.
const MONOREPO_ROOT = path.resolve(__dirname, '..');

// Packages that must be singletons (only one instance across the entire app)
const singletons = ['react', 'react-dom', 'react-native', 'scheduler'];

function resolveMonorepoPackage(pkg) {
  // Try root node_modules first (hoisted pnpm location)
  const rootPath = path.join(MONOREPO_ROOT, 'node_modules', pkg);
  if (fs.existsSync(path.join(rootPath, 'package.json'))) {
    return rootPath;
  }
  // Try local node_modules
  const localPath = path.join(__dirname, 'node_modules', pkg);
  if (fs.existsSync(path.join(localPath, 'package.json'))) {
    return localPath;
  }
  return null;
}

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Force singleton resolution to monorepo root copies
  config.resolve = config.resolve || {};
  config.resolve.alias = config.resolve.alias || {};

  for (const pkg of singletons) {
    const resolved = resolveMonorepoPackage(pkg);
    if (resolved) {
      config.resolve.alias[pkg] = resolved;
    }
  }

  // Do NOT alias expo-modules-core to a specific file — subpath imports like
  // 'expo-modules-core/build/EventEmitter' would break. Instead we patch
  // index.js to re-export build/index.js (done via postinstall patch).

  return config;
};

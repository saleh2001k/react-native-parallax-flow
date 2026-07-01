const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const packageRoot = path.resolve(projectRoot, '..');
const exampleModules = path.resolve(projectRoot, 'node_modules');
const exampleRnEntry = path.join(exampleModules, 'react-native/package.json');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [packageRoot];

const { resolver } = config;

// Single copy of React / RN for app + linked library (avoids invalid hook call)
resolver.disableHierarchicalLookup = true;
resolver.nodeModulesPaths = [exampleModules];

resolver.extraNodeModules = {
  ...resolver.extraNodeModules,
  'react-native-parallax-flow': packageRoot,
  react: path.join(exampleModules, 'react'),
  'react-native': path.join(exampleModules, 'react-native'),
  'react-native-reanimated': path.join(exampleModules, 'react-native-reanimated'),
  'react-native-worklets': path.join(exampleModules, 'react-native-worklets'),
};

const escapedPackageNodeModules = path
  .join(packageRoot, 'node_modules')
  .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
resolver.blockList = [
  ...(resolver.blockList ?? []),
  new RegExp(`^${escapedPackageNodeModules}(/|$)`),
];

const forceFromExample = (moduleName) =>
  moduleName === 'react' ||
  moduleName.startsWith('react/') ||
  moduleName === 'react-native' ||
  moduleName.startsWith('react-native/');

resolver.resolveRequest = (context, moduleName, platform) => {
  if (forceFromExample(moduleName)) {
    return context.resolveRequest(
      { ...context, originModulePath: exampleRnEntry },
      moduleName,
      platform,
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

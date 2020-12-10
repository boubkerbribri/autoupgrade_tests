const path = require('path');
const basePath = path.resolve(__dirname);
console.log(basePath);

module.exports = [
  {
    file: 'BO/modules/upgrade.js',
    versions: {
      '1.7.4': `${basePath}/versions/174/BO/modules/upgrade.js`,
      '1.7.5': `${basePath}/versions/175/BO/modules/upgrade.js`,
      '1.7.6': `${basePath}/versions/176/BO/modules/upgrade.js`,
      '1.7.7': `${basePath}/versions/177/BO/modules/upgrade.js`,
    },
  },
  {
    file: 'BO/modules/moduleCatalog.js',
    versions: {
      '1.7.4': `${basePath}/versions/175/BO/modules/moduleCatalog.js`,
      '1.7.5': `${basePath}/versions/175/BO/modules/moduleCatalog.js`,
      '1.7.6': `${basePath}/versions/176/BO/modules/moduleCatalog.js`,
      '1.7.7': `${basePath}/versions/177/BO/modules/moduleCatalog.js`,
    },
  },
  {
    file: 'BO/modules/moduleManager.js',
    versions: {
      '1.7.4': `${basePath}/versions/174/BO/modules/moduleManager.js`,
      '1.7.5': `${basePath}/versions/175/BO/modules/moduleManager.js`,
      '1.7.6': `${basePath}/versions/176/BO/modules/moduleManager.js`,
      '1.7.7': `${basePath}/versions/177/BO/modules/moduleManager.js`,
    },
  },
];

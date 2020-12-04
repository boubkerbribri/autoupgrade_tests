const path = require('path');
const basePath = path.resolve(__dirname);
console.log(basePath);

module.exports = [
  {
    file: 'BO/modules/upgrade.js',
    versions: {
      '1.7.6': `${basePath}/versions/176/BO/modules/upgrade.js`,
      '1.7.7': `${basePath}/versions/177/BO/modules/upgrade.js`,
    },
  },
  {
    file: 'BO/modules/moduleCatalog.js',
    versions: {
      '1.7.6': `${basePath}/versions/176/BO/modules/moduleCatalog.js`,
      '1.7.7': `${basePath}/versions/177/BO/modules/moduleCatalog.js`,
    },
  },
];

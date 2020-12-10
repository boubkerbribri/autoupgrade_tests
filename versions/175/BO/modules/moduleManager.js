// Get resolver
const VersionSelectResolver = require('prestashop_test_lib/kernel/resolvers/versionSelectResolver');

const configClassMap = require('../../../../configClassMap.js');

const versionSelectResolver = new VersionSelectResolver(global.PS_VERSION, configClassMap);

// Import BOBasePage
const ModuleManagerPage = versionSelectResolver.require('BO/modules/moduleManager/index.js');

class ModuleManager extends ModuleManagerPage.constructor {
  constructor() {
    super();

    this.selectionPageTitle = 'Module selection •';

    // Selectors
  }

  /*
  Methods
   */

}

module.exports = new ModuleManager();

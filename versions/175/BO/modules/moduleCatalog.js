// Get resolver
const VersionSelectResolver = require('prestashop_test_lib/kernel/resolvers/versionSelectResolver');

const configClassMap = require('@root/configClassMap.js');

const versionSelectResolver = new VersionSelectResolver(global.PS_VERSION, configClassMap);

// Import BOBasePage
const ModuleCatalogPage = versionSelectResolver.require('BO/modules/moduleCatalog/index.js');

class ModuleCatalog extends ModuleCatalogPage.constructor {
  constructor() {
    super();

    // Selectors
    this.moduleBloc = moduleName => `#modules-list-container-all div[data-name='${moduleName}']:not([style])`;
    this.configureModuleButton = moduleName => `${this.moduleBloc(moduleName)} div.module-actions a[href*='configure']`;
  }

  /*
  Methods
   */
  /**
   * Go to module configuration page
   * @param page
   * @param moduleName
   * @returns {Promise<void>}
   */
  async goToModuleConfigurationPage(page, moduleName) {
    await this.clickAndWaitForNavigation(page, this.configureModuleButton(moduleName));
  }
}

module.exports = new ModuleCatalog();

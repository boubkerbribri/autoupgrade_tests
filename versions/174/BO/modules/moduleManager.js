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
    this.moduleBloc = moduleName => `#modules-list-container-all div[data-name='${moduleName}']:not([style])`;
    this.configureModuleButton = moduleName => `${this.moduleBloc(moduleName)}  button[data-confirm_modal*='configure']`;
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

module.exports = new ModuleManager();

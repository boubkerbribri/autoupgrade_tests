// Get resolver
const VersionSelectResolver = require('prestashop_test_lib/kernel/resolvers/versionSelectResolver');

const configClassMap = require('../../../../configClassMap.js');

const versionSelectResolver = new VersionSelectResolver(global.PS_VERSION, configClassMap);

// Import BOBasePage
const ModuleConfigurationPage = versionSelectResolver.require('BO/modules/moduleConfiguration/index.js');

class Upgrade extends ModuleConfigurationPage.constructor {
  constructor() {
    super();

    this.pageTitle = '1-Click Upgrade';

    // Selectors
    this.titleBlock = 'h1.page-title';

    // Expert mode form
    this.channelSelect = '#channel';
    this.archiveSelect = '#archive_prestashop';
    this.saveButton = '#advanced  input[name="submitConf-channel"]'
  }

  /**
   * @override
   * Get page title
   * @param page
   * @return {Promise<string>}
   */
  getPageTitle(page) {
    return this.getTextContent(page, this.titleBlock);
  }

  /**
   * Fill expert mode form
   * @param page
   * @param channel
   * @param archive
   * @returns {Promise<void>}
   */
  async fillExpertModeForm(page, channel, archive){
    await this.selectByVisibleText(page, this.channelSelect, channel);
    await this.selectByVisibleText(page, this.archiveSelect, archive);
    await this.setValue(page, '1.7.7.0');

    await page.click(this.saveButton);
  }
}

module.exports = new Upgrade();

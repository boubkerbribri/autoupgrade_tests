// Get resolver
const VersionSelectResolver = require('prestashop_test_lib/kernel/resolvers/versionSelectResolver');

const configClassMap = require('../../../../configClassMap.js');

const versionSelectResolver = new VersionSelectResolver(global.PS_VERSION, configClassMap);

// Import BOBasePage
const ModuleConfigurationPage = versionSelectResolver.require('BO/modules/moduleConfiguration/index.js');
const fs = require('fs');
const exec = require('child_process').exec;

class Upgrade extends ModuleConfigurationPage.constructor {
  constructor() {
    super();

    this.pageTitle = '1-Click Upgrade';
    this.configResultValidationMessage = 'Configuration successfully updated. ';

    // Selectors
    this.titleBlock = 'h1.page-title';

    // Current configuration form
    this.currentConfigurationForm = '#currentConfiguration';
    this.putShopUnderMaintenanceButton = `${this.currentConfigurationForm} input[name='putUnderMaintenance']`;
    this.checklistTableRow = row => `${this.currentConfigurationForm} tbody tr:nth-child(${row})`;
    this.checklistTableColumnImage = (row) => `${this.checklistTableRow(row)} td.img`;

    // Expert mode form
    this.channelSelect = '#channel';
    this.archiveSelect = '#archive_prestashop';
    this.saveButton = '#advanced  input[name="submitConf-channel"]';
    this.configResultAlert = '#configResult';
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
   * Copy the zip to admin_dev/upgrade/download directory
   * @param page
   * @param projectPath
   * * @param downloadPath
   * @param zipName
   * @returns {Promise<void>}
   */
  copyZipToUpgradeDirectory(page, projectPath, downloadPath, zipName) {
    exec(`sudo chmod 777 -R ${projectPath}/admin-dev/`);
    exec(`sudo cp ${downloadPath}/${zipName} ${projectPath}/admin-dev/autoupgrade/download`);
    exec(`sudo chmod 777 -R ${projectPath}/admin-dev/autoupgrade/`);
  }

  /**
   * Fill expert mode form
   * @param page
   * @param channel
   * @param archive
   * @returns {Promise<string>}
   */
  async fillExpertModeForm(page, channel, archive) {
    await page.waitForTimeout(10000);
    await this.selectByVisibleText(page, this.channelSelect, channel);
    await this.selectByVisibleText(page, this.archiveSelect, archive);
    await this.setValue(page, '1.7.7.0');

    await page.click(this.saveButton);
    return this.getTextContent(page, this.configResultValidationMessage);
  }

  /**
   * Put shop under maintenance
   * @param page
   * @returns {Promise<void>}
   */
  async putShopUnderMaintenance(page) {
    if (this.elementVisible(page, this.putShopUnderMaintenanceButton, 2000)) {
      await page.click(this.putShopUnderMaintenanceButton);
    }
  }

  /**
   * Get all checklist image column content
   * @param page
   * @param row
   * @returns {Promise<[]>}
   */
  async getRowImageContent(page, row) {
    return this.getAttributeContent(page, this.checklistTableColumnImage(row), 'alt');
  }
}

module.exports = new Upgrade();

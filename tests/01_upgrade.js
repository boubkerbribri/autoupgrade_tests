require('module-alias/register');
require('@root/globals.js');

const {expect} = require('chai');
const helper = require('prestashop_test_lib/kernel/utils/helpers');
const filesHelper = require('@root/utils/filesHelper.js');

// Get resolver
const VersionSelectResolver = require('prestashop_test_lib/kernel/resolvers/versionSelectResolver');

const configClassMap = require('@root/configClassMap.js');

const versionSelectResolver = new VersionSelectResolver(global.PS_VERSION, configClassMap);
const newVersionSelectResolver = new VersionSelectResolver(global.PS_VERSION_UPGRADE_TO, configClassMap);

// Import pages
const loginPage = versionSelectResolver.require('BO/login/index.js');
const dashboardPage = versionSelectResolver.require('BO/dashboard/index.js');
const moduleCatalogPage = versionSelectResolver.require('BO/modules/moduleCatalog/index.js');
const moduleManagerPage = versionSelectResolver.require('BO/modules/moduleManager/index.js');
const upgradeModulePage = versionSelectResolver.require('BO/modules/autoupgrade/index.js');
const newLoginPage = newVersionSelectResolver.require('BO/login/index.js');

// Browser vars
let browserContext;
let page;

const moduleToInstall = {
  name: '1-Click Upgrade',
  tag: 'autoupgrade',
  downloadFolder: `${global.PS_FOLDER.ADMIN}/modules/autoupgrade/download`,
};

/*
Go to login page
Check PS version
Log in
Install 1-Click Upgrade module
Upgrade
Log out
Check new version
 */
describe(`Upgrade Prestashop : from '${global.PS_VERSION}' to '${global.PS_VERSION_UPGRADE_TO}'`, async () => {
  // before and after functions
  before(async function () {
    browserContext = await helper.createBrowserContext(this.browser);

    page = await helper.newTab(browserContext);
  });

  after(async () => {
    await helper.closeBrowserContext(browserContext);
  });

  it('should go to login page', async () => {
    await loginPage.goTo(page, global.BO.URL);

    const pageTitle = await loginPage.getPageTitle(page);
    await expect(pageTitle).to.contains(loginPage.pageTitle);
  });

  it('should check PS version', async () => {
    const psVersion = await loginPage.getPrestashopVersion(page);
    await expect(psVersion).to.contains(global.PS_VERSION);
  });

  it('should login into BO with default user', async () => {
    await loginPage.login(page, global.BO.EMAIL, global.BO.PASSWD);
    await dashboardPage.closeOnboardingModal(page);

    const pageTitle = await dashboardPage.getPageTitle(page);
    await expect(pageTitle).to.contains(dashboardPage.pageTitle);
  });

  if (global.PS_VERSION.includes('1.7.4')) {
    it('should go to Modules & Services page', async () => {
      await dashboardPage.goToSubMenu(
        page,
        dashboardPage.modulesParentLink,
        dashboardPage.moduleManagerLink,
      );

      const pageTitle = await moduleManagerPage.getPageTitle(page);
      await expect(pageTitle).to.contains(moduleManagerPage.pageTitle);
    });

    it('should go to Selection tab', async () => {
      await moduleManagerPage.goToSelectionPage(page);

      const pageTitle = await moduleCatalogPage.getPageTitle(page);
      await expect(pageTitle).to.contains(moduleCatalogPage.pageTitle);
    });
  } else {
    it('should go to Modules Catalog page', async () => {
      await dashboardPage.goToSubMenu(
        page,
        dashboardPage.modulesParentLink,
        dashboardPage.moduleCatalogueLink,
      );

      const pageTitle = await moduleCatalogPage.getPageTitle(page);
      await expect(pageTitle).to.contains(moduleCatalogPage.pageTitle);
    });
  }

  it('should search 1-Click Upgrade module', async () => {
    const isModuleVisible = await moduleCatalogPage.searchModule(page, moduleToInstall.tag, moduleToInstall.name);

    await expect(isModuleVisible).to.be.true;
  });

  it('should install 1-Click Upgrade module', async () => {
    const textResult = await moduleCatalogPage.installModule(page, moduleToInstall.name);

    await expect(textResult).to.contain(moduleCatalogPage.installMessageSuccessful(moduleToInstall.tag));
  });

  it('should go to module configuration page', async () => {
    await moduleCatalogPage.goToConfigurationPage(page, moduleToInstall.name);

    const pageTitle = await upgradeModulePage.getPageTitle(page);
    await expect(pageTitle).to.contains(upgradeModulePage.pageTitle);
  });

  it('should copy the new Zip to the auto upgrade directory', async () => {
    await filesHelper.moveFile(
      `${global.DOWNLOAD_PATH}/${global.ZIP_NAME}`,
      `${global.PS_FOLDER.PATH}/${moduleToInstall.downloadFolder}/${global.ZIP_NAME}`,
    );

    const doesUpgradeFileExist = await filesHelper.doesFileExist(
      `${global.PS_FOLDER.PATH}/${moduleToInstall.downloadFolder}/${global.ZIP_NAME}`,
    );

    await expect(doesUpgradeFileExist, 'File was not moved correctly').to.be.true;
  });

  it('should fill \'Expert mode\' form', async () => {
    const textResult = await upgradeModulePage.fillExpertModeForm(
      page,
      'Local archive',
      global.ZIP_NAME,
      global.PS_VERSION_UPGRADE_TO,
    );

    await expect(textResult).to.contain(upgradeModulePage.configResultValidationMessage);
  });

  it('should put the shop under maintenance and check if the checklist is all green', async () => {
    try {
      await upgradeModulePage.putShopUnderMaintenance(page);

      for (let i = 1; i <= 10; i++) {
        const textResult = await upgradeModulePage.getRowImageContent(page, i);
        await expect(textResult).to.equal('ok');
      }
    } catch (e) {
      await page.screenshot({path: './screen.png', fullPage: true});
      throw e;
    }
  });

  it('should click on \'UPGRADE PRESTASHOP NOW\' and wait for the upgrade', async () => {
    const testResult = await upgradeModulePage.upgradePrestaShopNow(page);
    await expect(testResult).to.equal(upgradeModulePage.upgradeValidationMessage);
  });

  it('should log out from BO', async () => {
    await upgradeModulePage.logoutBO(page);

    await newLoginPage.reloadPage(page);
    const pageTitle = await newLoginPage.getPageTitle(page);
    await expect(pageTitle).to.contains(newLoginPage.pageTitle);
  });

  it('should check PS version', async () => {
    const psVersion = await newLoginPage.getPrestashopVersion(page);
    await expect(psVersion).to.contains(global.PS_VERSION_UPGRADE_TO);
  });
});

require('/projet/prestashop_autoupgrade_tests/globals.js');
require('module-alias/register');

const {expect} = require('chai');
const helper = require('prestashop_test_lib/kernel/utils/helpers');

// Get resolver
const VersionSelectResolver = require('prestashop_test_lib/kernel/resolvers/versionSelectResolver');

const configClassMap = require('../configClassMap.js');

const versionSelectResolver = new VersionSelectResolver(global.PS_VERSION, configClassMap);

// Import pages
const loginPage = versionSelectResolver.require('BO/login/index.js');
const dashboardPage = versionSelectResolver.require('BO/dashboard/index.js');
const moduleCatalogPage = versionSelectResolver.require('BO/modules/moduleCatalog.js');
const upgradeModulePage = versionSelectResolver.require('BO/modules/upgrade.js');

// Browser vars
let browserContext;
let page;

const moduleToInstall = {
  name: '1-Click Upgrade',
  tag: 'autoupgrade',
};

/*
Go to login page
check PS version
Log in
Install 1-Click Upgrade module
Upgrade
Log out
 */
describe(`Upgrade Prestashop ${global.PS_VERSION} to ${global.PS_VERSION_TO_UPGRADE}`, async () => {
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

  it('should go to modules catalog page', async () => {
    if (global.PS_VERSION.includes('1.7.4')) {
      await dashboardPage.goToSubMenu(
        page,
        dashboardPage.modulesParentLink,
        dashboardPage.moduleManagerLink,
      );

      await moduleCatalogPage.goToSelectionPage(page);
    } else {
      await dashboardPage.goToSubMenu(
        page,
        dashboardPage.modulesParentLink,
        dashboardPage.moduleCatalogueLink,
      );
    }

    const pageTitle = await moduleCatalogPage.getPageTitle(page);
    await expect(pageTitle).to.contains(moduleCatalogPage.pageTitle);
  });

  it('should search 1-Click Upgrade module', async () => {
    const isModuleVisible = await moduleCatalogPage.searchModule(page, moduleToInstall.tag, moduleToInstall.name);

    await expect(isModuleVisible).to.be.true;
  });

  it('should install 1-Click Upgrade module', async () => {
    const textResult = await moduleCatalogPage.installModule(page, moduleToInstall.name);

    await expect(textResult).to.contain(moduleCatalogPage.installMessageSuccessful(moduleToInstall.tag));
  });

  it('should go to module configuration page', async () => {
    await moduleCatalogPage.goToModuleConfigurationPage(page, moduleToInstall.name);

    const pageTitle = await upgradeModulePage.getPageTitle(page);
    await expect(pageTitle).to.contains(upgradeModulePage.pageTitle);
  });

  it('should copy the new Zip to the auto upgrade directory', async () => {
    await upgradeModulePage.copyZipToUpgradeDirectory(page, global.PROJECT_PATH, global.DOWNLOAD_PATH, global.ZIP_NAME);
  });

  it('should fill \'Expert mode\' form', async () => {
    const textResult = await upgradeModulePage.fillExpertModeForm(page, 'Local archive', global.ZIP_NAME);

    await expect(textResult).to.contain(upgradeModulePage.configResultAlert);
  });

  it('should put the shop under maintenance and check that the checklist is all green', async () => {
    await upgradeModulePage.putShopUnderMaintenance();

    for (let i = 1; i <= 10; i++) {
      const textResult = await upgradeModulePage.getRowImageContent(page, i);
      await expect(textResult).to.equal('ok');
    }
  });

  it('should log out from BO', async () => {
    await dashboardPage.logoutBO(page);

    const pageTitle = await loginPage.getPageTitle(page);
    await expect(pageTitle).to.contains(loginPage.pageTitle);
  });
});
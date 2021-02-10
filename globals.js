global.PS_VERSION = '1.7.4';
global.PS_VERSION_UPGRADE_FROM = global.PS_VERSION;
global.PS_VERSION_UPGRADE_TO = process.env.PS_VERSION_UPGRADE_TO || '1.7.8';
global.DOWNLOAD_PATH = process.env.DOWNLOAD_PATH || '/home/bbribri/Téléchargements';
global.ZIP_NAME = process.env.ZIP_NAME || '2021-02-10-develop-prestashop_1.7.8.0.zip';
global.PS_FOLDER = {
  PATH: process.env.PROJECT_PATH || '/var/www/html/174',
  ADMIN: process.env.PS_FOLDER_ADMIN || 'admin-dev',
};

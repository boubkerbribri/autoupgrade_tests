const axios = require('axios');

const apiUrl = 'https://api-nightly.prestashop.com/reports';

/**
 * Get reports from nightly api
 * @returns {Promise<*>}
 */
function getReports() {
  return axios.get(apiUrl);
}

/**
 * Get today reports from nightly api
 * @returns {Promise<[]>}
 */
async function getTodayReports() {
  // Get today date
  let today = new Date().toJSON().slice(0,10);

  // Get reports
  const reportsData = (await getReports()).data

  return reportsData.filter(report => report.date === today && report.download !== null);
}

/**
 * Get version from a filename
 * @param filename
 * @returns {string}
 */
function getVersionFormFilename(filename) {
  return (filename.match('prestashop_(.*).zip'))[1];
}

/**
 * Get output part of the matrix
 * @returns {Promise<[]>}
 */
async function getTargetVersions() {
  const todayReports = await getTodayReports();

  let targetVersions = [];

  for(let i=0; i<todayReports.length; i++) {
    const downloadReportUrl = todayReports[i].download;

    const row = {
      for_test: getVersionFormFilename(downloadReportUrl),
      filename: downloadReportUrl.substr(downloadReportUrl.lastIndexOf('/') + 1),
    }

    await targetVersions.push(row);
  }

  console.log(targetVersions);
}

getTargetVersions();
const fs = require('fs');

module.exports = {
  /**
   * Move file
   * @param oldPath
   * @param newPath
   * @returns {Promise<void>}
   */
  async moveFile(oldPath, newPath) {
    await fs.rename(oldPath, newPath, (err) => {
      if (err) throw err;
    });
  },

  /**
   * Check if file was download in path
   * @param filePath
   * @param timeDelay
   * @returns {Promise<boolean>}
   */
  async doesFileExist(filePath, timeDelay = 5000) {
    let found = false;

    for (let i = 0; i <= timeDelay && !found; i += 100) {
      await (new Promise(resolve => setTimeout(resolve, 100)));
      found = await fs.existsSync(filePath);
    }

    return found;
  },
};

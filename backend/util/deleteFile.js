const fs = require("fs");

const deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(`Error deleting file ${filePath}: ${err.message}`);
          } else {
            resolve();
          }
        });
      } else {
        resolve(); // File doesn't exist, resolve silently
      }
    });
  };

  module.exports = {deleteFile}
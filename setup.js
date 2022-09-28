const fs = require('fs');
const path = require('path');
const { start } = require('repl');

function createDirectory() {
  const uploadDirs = ['resources', 'uploads', 'uploads/image', 'uploads/video', 'uploads/other'];

  uploadDirs
    .map((dir) => path.resolve(dir))
    .forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
}

function startSetup() {
  createDirectory();
}

module.exports = startSetup;

const fs = require('fs');

function getFilesFromDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  files.sort();
  const fileList = [];

  var idx = 1;
  files.forEach((file) => {
    fileList.push({ id: idx, file });
    idx++;
  });

  return fileList;
}

module.exports = { getFilesFromDirectory };

const fs = require('fs');

function getFilesFromDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  files.sort();
  const fileList = [];

  var idx = 1;
  files.forEach((file) => {
    // check if file is a video file
    // file types: mp4, avi, mkv, mov, wmv, flv, webm, m4v
    if (!file.match(/\.(mp4|avi|mkv|mov|wmv|flv|webm|m4v)$/i)) {
      return;
    }
    fileList.push({ id: idx, name: file, file });
    idx++;
  });

  return fileList;
}

module.exports = { getFilesFromDirectory };

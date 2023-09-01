const fs = require('fs');
const { exec } = require('child_process');
const { getFilesFromDirectory } = require('./fileUtils');

// Function to reserve a song by ID
function reserveSong(id) {
  const directoryPath = process.env.directoryPath;

  // Get the list of files from the directory
  const files = getFilesFromDirectory(directoryPath);

  // Find the JSON data for the song with the matching ID
  const jsonData = files
    .find((data) => data.id === id);

  if (!jsonData) {
    console.error('Song not found!');
    return;
  }

  // Get the file name from the JSON data
  const fileName = jsonData.file;

  // Execute the VLC command with the file path
  const vlcCommand = `open -a /Applications/VLC.app/Contents/MacOS/VLC "${directoryPath}/${fileName}"`;
  exec(vlcCommand, (error) => {
    if (error) {
      console.error(`Error opening file: ${error.message}`);
    } else {
      console.log(`VLC opened the file: ${fileName}`);
    }
  });
  return fileName;
}

module.exports = {reserveSong};

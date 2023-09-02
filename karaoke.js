const { exec } = require('child_process');
const { getFilesFromDirectory } = require('./fileUtils');

const directoryPath = process.env.directoryPath;
const vlcCli = `vlc`
var reservedSongs = [];

// Function to reserve a song by ID
function reserveSong(id) {
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
  const song = jsonData;

  // queue the song
  addToQueue(song);
  return song.name;
}

function addToQueue(file) {
  reservedSongs.push(file);
  
  if(reservedSongs.length == 1) {
    playNext();
  }
}

function playNext() {
  if (reservedSongs.length == 0) {
    return;
  }
  
  const file = reservedSongs[0].file;
  const vlcCommand = `${vlcCli} "${directoryPath}/${file}" --fullscreen vlc://quit`;
  
  executeCommand(vlcCommand)
    .then(() => {
      // Proceed to the next song in the queue
      reservedSongs.shift();
      playNext();
    })
    .catch((error) => {
      console.error(`Error: ${error.message || error}`);
    });
}

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function skipSong() {
  if (reservedSongs.length > 0) {
    // Execute a command to skip to the next song in VLC
    const skipCommand = `${vlcCli} --control next`;
    executeCommand(skipCommand)
      .then(() => {
        // Proceed to the next song in the queue
        reservedSongs.shift();
        playNext();
        console.log('Skipped to the next song');
      })
      .catch((error) => {
        console.error(`Error: ${error.message || error}`);
      });
  } else {
    console.log('No more songs to skip');
  }
}

function reservedSongs() {
  return reservedSongs;
}

module.exports = {reserveSong, reservedSongs, skipSong};

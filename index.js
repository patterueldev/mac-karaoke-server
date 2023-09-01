const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());
const port = 3000; // Replace with your desired port number


const { getFilesFromDirectory } = require('./fileUtils');
const { reserveSong } = require('./karaoke');

// Usage example
const directoryPath = process.env.directoryPath;
const filesArray = getFilesFromDirectory(directoryPath);

// Routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/songs', (req, res) => {
  res.send(filesArray);
});

app.post('/reserve', (req, res) => {
  console.log(reserveSong);
  var file = reserveSong(req.body.id);
  res.send('Song reserved! Title: ' + file);
});

app.get('/testjson', (req, res) => {
  res.send({'test': 'test'});
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

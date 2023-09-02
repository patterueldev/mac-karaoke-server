import express, { Request, Response } from 'express';
import GenericResponse from './common/GenericResponse';
import { getSongListUseCase } from './dependencies';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  var response = GenericResponse.success('Welcome!');
  res.send(response);
});

router.get('/songs', async (req: Request, res: Response) => {
  var songs = await getSongListUseCase.execute();
  var response = GenericResponse.success(songs);
  res.send(response);
})

// const { getFilesFromDirectory } = require('./fileUtils');
// const { reserveSong, reservedSongs, skipSong } = require('./karaoke');

// // Usage example
// const directoryPath = process.env.directoryPath;
// const filesArray = getFilesFromDirectory(directoryPath);

// // Routes
// // convert to typescript


// app.get('/test', (req: Request, res: Response) => {
//   res.send('Hello, world!');
// });
// app.get('/', (req, res) => {
//   res.send('Hello, world!');
// });

// app.get('/songs', (req, res) => {
//   res.send(filesArray);
// });


// app.post('/reserve', (req, res) => {
//   console.log(reserveSong);
//   var file = reserveSong(req.body.id);
//   res.send('Song reserved! Title: ' + file);
// });

// app.get('/reserved', (req, res) => {
//   res.send(reservedSongs);
// });

// app.post('/skip', (req, res) => {
//   res.send(skipSong());
// });

// app.get('/testjson', (req, res) => {
//   res.send({'test': 'test'});
// });

export default router;
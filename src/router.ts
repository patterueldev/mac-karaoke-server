import express, { Request, Response } from 'express';
import GenericResponse from './common/GenericResponse';
import { generateServerQRUseCase, getReservedSongListUseCase, getSongListUseCase, reserveSongUseCase, synchronizeRecordsUseCase } from './dependencies';

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

router.post('/sync', async (req: Request, res: Response) => {
  await synchronizeRecordsUseCase.execute();
  var response = GenericResponse.success('Records synchronized!');
  res.send(response);
})

router.post('/reserve', async (req: Request, res: Response) => {
  var response: GenericResponse;
  try {
    var song = await reserveSongUseCase.execute(req.body.id);
    var message = `Song reserved! Title: ${song.title}`;
    response = GenericResponse.success(message);
  } catch (error) {
    response = GenericResponse.failure(error);
  }
  res.send(response);
});

router.get('/reserved', async (req: Request, res: Response) => {
  var songs = await getReservedSongListUseCase.execute();
  var response = GenericResponse.success(songs);
  res.send(response);
});

router.get('/qr', async (req: Request, res: Response) => {
  var qr = await generateServerQRUseCase.execute();
  // this is actually a base64 image, so we can return a <img> tag
  var html = `<img src="${qr}">`;
  res.send(html);
});
// app.post('/skip', (req, res) => {
//   res.send(skipSong());
// });

// app.get('/testjson', (req, res) => {
//   res.send({'test': 'test'});
// });

export default router;
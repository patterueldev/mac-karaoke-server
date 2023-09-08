import express, { Request, Response } from 'express';
import GenericResponse from './common/GenericResponse';
import { autoUpdateSongsUseCase, generateServerQRUseCase, getReservedSongListUseCase, getSongListUseCase, removeReservedSongUseCase, reserveSongUseCase, stopCurrentSongUseCase, synchronizeRecordsUseCase } from './dependencies';

const router = express.Router();

router.get('/songs', async (req: Request, res: Response) => {
  console.log('GET /songs');
  var limit = req.query.limit || req.body.limit || undefined;
  var offset = req.query.offset || req.body.offset || undefined;
  var filter = req.query.filter || req.body.filter || undefined;
  var songs = await getSongListUseCase.execute(filter, offset, limit);
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
    var queryId = req.query.id;
    var bodyId = req.body.id;
    var id = queryId || bodyId;
    if (!id) throw new Error('Missing id');
    var song = await reserveSongUseCase.execute(id);
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

router.post('/autoupdate', async (req: Request, res: Response) => {
  var queryLimit = req.query.limit;
  var bodyLimit = req.body.limit;
  var rawLimit = queryLimit || bodyLimit || 5;
  const limit = Math.min(Math.max(rawLimit, 1), 10);
  var result = await autoUpdateSongsUseCase.execute(limit);
  var response = GenericResponse.success(result, 'Songs updated!');
  res.send(response);
})

router.delete('/reserved/:id/cancel', async (req: Request, res: Response) => {
  var id = req.params.id;
  try {
    var result = await removeReservedSongUseCase.execute(id);
    var response = GenericResponse.success('Song removed!');
    res.send(response);
  } catch (error) {
    var response = GenericResponse.failure(error);
    res.status(response.status).send(response);
  }
})

router.delete('/current/stop', async (req: Request, res: Response) => {
  await stopCurrentSongUseCase.execute();
  var response = GenericResponse.success('Song stopped!');
  res.send(response);
});

// app.post('/skip', (req, res) => {
//   res.send(skipSong());
// });

// app.get('/testjson', (req, res) => {
//   res.send({'test': 'test'});
// });

export default router;
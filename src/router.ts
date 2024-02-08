import express, { Request, Response } from 'express';
import GenericResponse from './common/GenericResponse';
import Dependencies from './common/Dependencies';
import Song from './domain/entities/Song';

const router = express.Router();

router.get('/songs', async (req: Request, res: Response) => {
  console.log('GET /songs');
  var limit = req.query.limit || req.body.limit || undefined;
  var offset = req.query.offset || req.body.offset || undefined;
  var filter = req.query.filter || req.body.filter || undefined;
  await GenericResponse.send(res, async () => {
    return await Dependencies.getSongListUseCase().execute(filter, offset, limit);
  });
})

router.post('/songs/item/:id/queue', async (req: Request, res: Response) => {
  var id = req.params.id;
  await GenericResponse.send(res, async () => {
      var song = await Dependencies.reserveSongUseCase().execute(id);
      return `Song added to queue! Title: ${song.title}`;
  });
});

router.get('/songs/item/:id/optimized', async (req: Request, res: Response) => {
  var id = req.params.id;
  await GenericResponse.send(res, async () => {
    return await Dependencies.optimizedSongDataUseCase().execute(id);
  });
});

router.delete('/songs/item/:id/remove', async (req: Request, res: Response) => {
  var id = req.params.id;
  await GenericResponse.send(res, async () => {
    await Dependencies.removeSongUseCase().execute(id);
    return 'Song removed!';
  });
});

router.post('/songs/identify', async (req: Request, res: Response) => {
  await GenericResponse.send(res, async () => {
    let url = req.query.url || req.body.url || undefined;
    if(!url) throw new Error('No url provided!');
    return await Dependencies.getSongMetadataForUrlUseCase().execute(url);
  });
});

router.post('/songs/download', async (req: Request, res: Response) => {
  await GenericResponse.send(res, async () => {
    let song: Song = req.body as Song;
    console.log('Downloading song: ' + song.title)
    return await Dependencies.downloadSongUseCase().execute(song);
  }, 'Download started!');
});

router.get('/queue', async (req: Request, res: Response) => {
  await GenericResponse.send(res, async () => {
    return await Dependencies.getReservedSongListUseCase().execute();
  });
});

router.delete('/queue/item/:id/cancel', async (req: Request, res: Response) => {
  var id = req.params.id;
  await GenericResponse.send(res, async () => {
    await Dependencies.removeReservedSongUseCase().execute(id);
    return 'Queued song removed!';
  });
})

router.delete('/queue/current/cancel', async (req: Request, res: Response) => {
  await GenericResponse.send(res, async () => {
    await Dependencies.stopCurrentSongUseCase().execute();
    return 'Current song stopped!';
  });
});

// For Data Optimization
router.post('/data/sync', async (req: Request, res: Response) => {
  await GenericResponse.send(res, async () => {
    await Dependencies.synchronizeRecordsUseCase().execute();
    return 'Records synchronized!';
  });
})

router.post('/data/autoupdate', async (req: Request, res: Response) => {
  var queryLimit = req.query.limit;
  var bodyLimit = req.body.limit;
  var rawLimit = queryLimit || bodyLimit || 5;
  const limit = Math.min(Math.max(rawLimit, 1), 10);
  await GenericResponse.send(res, async () => {
    return await Dependencies.autoUpdateSongsUseCase().execute(limit);
  });
})

export default router;
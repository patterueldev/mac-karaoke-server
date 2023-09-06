import dotenv from 'dotenv';
dotenv.config();

import express, {Request, Response} from 'express';
import router from './router';
import { getSongWithIDUseCase, restoreReservedSongsUseCase, serverPort, songsPath } from './dependencies';

const app = express();
app.use(express.json());
app.use('/api', router);

app.use('/song', async (req: Request, res: Response) => {
  const identifier = req.query.id as (string | undefined);
  if (!identifier) {
    res.status(400).send('Missing identifier');
    return;
  }
  const record = await getSongWithIDUseCase.execute(identifier);
  const filename = record.file;
  const path = `${songsPath}/${filename}`;
  res.status(200).sendFile(path);
})

restoreReservedSongsUseCase.execute().then(() => {
  console.log('Restored reserved songs');
  app.listen(serverPort, () => {
    console.log(`Server listening on port ${serverPort}`);
  });
});
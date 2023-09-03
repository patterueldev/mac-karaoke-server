import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import router from './router';
import { restoreReservedSongsUseCase, serverPort } from './dependencies';

const app = express();
app.use(express.json());
app.use('/', router);

restoreReservedSongsUseCase.execute().then(() => {
  console.log('Restored reserved songs');
  app.listen(serverPort, () => {
    console.log(`Server listening on port ${serverPort}`);
  });
});
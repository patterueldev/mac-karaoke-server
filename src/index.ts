import dotenv from 'dotenv';
dotenv.config();

import express, {Request, Response} from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

import router from './router';
import { expressApp, getReservedSongListUseCase, getSongWithIDUseCase, restoreReservedSongsUseCase, serverPort, socketIO, socketServer, songsPath } from './dependencies';

import './socket';
const app = expressApp;
const server = socketServer;

app.use(express.json());
app.use('/api', router);
app.use('/song', async (req: Request, res: Response) => {
  const identifier = req.query.id as (string | undefined);
  if (!identifier) {
    res.status(400).send('Missing identifier');
    return;
  }
  const record = await getSongWithIDUseCase.execute(identifier);
  const filename = record.source;
  const path = `${songsPath}/${filename}`;
  res.status(200).sendFile(path);
})

server.listen(serverPort, () => {
  console.log(`Socket listening on port ${serverPort}`);
});
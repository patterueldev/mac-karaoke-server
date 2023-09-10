import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
dotenv.config();

import Dependencies from './common/Dependencies';
import Constants from './common/Constants';

import router from './router';
import './socket';

const app = Dependencies.expressApp();
const server = Dependencies.httpServer();

app.use(express.json());
app.use('/api', router);
app.get('/qr', async (req: Request, res: Response) => {
  let img = await Dependencies.generateServerQRUseCase().execute();
  res.send(img);
});
app.use('/media/:id', async (req: Request, res: Response) => {
  const identifier = req.params.id;
  let path = await Dependencies.getSongMediaPathUseCase().execute(identifier)
  res.sendFile(path);
})

server.listen(Constants.serverPort(), () => {
  console.log(`Socket listening on port ${Constants.serverPort()}`);
});
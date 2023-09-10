import { Socket } from 'socket.io';
import Dependencies from './common/Dependencies';
import { Event } from './common/Event';

let socketIO = Dependencies.socketServer();
socketIO.on('connection', (socket: Socket) => {
  console.log('A client connected: ' + socket.id);

  socket.on(Event.PlayerClientConnected, async () => {
    console.log(`Player client ${socket.id} connected`);
    await Dependencies.onPlayerClientConnectedUseCase().execute(socket);

    socket.on(Event.PlayerClientFinishedPlaying, async () => {
      console.log('PlayerClientFinishedPlaying from: ' + socket.id)
      await Dependencies.onPlayerClientFinishedPlayingUseCase().execute();
    });
  });

  socket.on(Event.ControllerClientConnected, async () => {
    console.log(`Controller client ${socket.id} connected`);
    await Dependencies.onControllerClientConnectedUseCase().execute(socket);
    
    socket.on(Event.ControllerSongStopped, async () => {
      console.log('ControllerSongStopped from: ' + socket.id)
      await Dependencies.onControllerSongStopUseCase().execute();
    });
  });
});

socketIO.on('connect_error', (err) => {
  console.log(`connect_error due to ${err.message}`);
});

socketIO.on('disconnect', () => {
  console.log('A client disconnected');
});

export const socket = socketIO;
import http from 'http';
import {Express} from 'express';
import { Server, Socket } from 'socket.io';
import { getReservedSongListUseCase, onControllerClientConnectedUseCase, onControllerSongStopUseCase, onPlayerClientConnectedUseCase, onPlayerClientFinishedPlayingUseCase, socketIO, stopCurrentSongUseCase } from './dependencies';
import { Event } from './common/Event';

// 
socketIO.on('connection', (socket: Socket) => {
  console.log('A client connected: ' + socket.id);

  socket.on(Event.PlayerClientConnected, async () => {
    console.log(`Player client ${socket.id} connected`);
    await onPlayerClientConnectedUseCase.execute(socket);

    socket.on(Event.PlayerClientFinishedPlaying, async () => {
      console.log('PlayerClientFinishedPlaying from: ' + socket.id)
      await onPlayerClientFinishedPlayingUseCase.execute();
    });
  });

  socket.on(Event.ControllerClientConnected, async () => {
    console.log(`Controller client ${socket.id} connected`);
    await onControllerClientConnectedUseCase.execute(socket);
    
    socket.on(Event.ControllerSongStopped, async () => {
      console.log('ControllerSongStopped from: ' + socket.id)
      await onControllerSongStopUseCase.execute();
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
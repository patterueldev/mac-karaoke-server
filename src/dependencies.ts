import OpenAI from "openai";
import http, { get } from 'http';
import express, {Express} from 'express';
import { Server } from "socket.io";
import KaraokeManager, { DefaultKaraokeManager } from "./common/KaraokeManager";
import KaraokeDataSource from "./data/dataSources/KaraokeDataSource";
import GenerateServerQRUseCase, { DefaultGenerateServerQRUseCase } from "./domain/useCases/GenerateServerQRUseCase";
import GetReservedSongListUseCase, { DefaultGetReservedSongListUseCase } from "./domain/useCases/GetReservedSongListUseCase";
import GetSongListUseCase, { DefaultGetSongListUseCase } from "./domain/useCases/GetSongListUseCase";
import ReserveSongUseCase, { DefaultReserveSongUseCase } from "./domain/useCases/ReserveSongUseCase";
import RestoreReservedSongsUseCase, { DefaultRestoreReservedSongsUseCase } from "./domain/useCases/RestoreReservedSongsUseCase";
import SynchronizeRecordsUseCase, { DefaultSynchronizeRecordsUseCase } from "./domain/useCases/SynchronizeRecordsUseCase";
import AutoUpdateSongsUseCase, { DefaultAutoUpdateSongsUseCase } from "./domain/useCases/AutoUpdateSongsUseCase";
import RemoveReservedSongUseCase, { DefaultRemoveReservedSongUseCase } from "./domain/useCases/RemoveReservedSongUseCase";
import StopCurrentSongUseCase, { DefaultStopCurrentSongUseCase } from "./domain/useCases/StopCurrentSongUseCase";

// Express
const app: Express = express();
app.use(express.json());

// Socket.io
const server = http.createServer(app);
const socketIOServer: Server = new Server(server);

// Load environment variables
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Missing mongodb uri');
const directoryPath = process.env.DIRECTORY_PATH;
if (!directoryPath) throw new Error('Missing directory path');
const port = process.env.SERVER_PORT;
if (!port) throw new Error('Missing port');
const openAIKey = process.env.OPENAI_API_KEY;
if (!openAIKey) throw new Error('Missing openai api key');
const openAISongPrompt = process.env.OPENAI_SONG_PROMPT;
if (!openAISongPrompt) throw new Error('Missing openai song prompt');

// fs: symbolically link the directory path to the public folder
// so that the client can access the files
import fs from 'fs';
import path from "path";
import GetSongUseCase, { DefaultGetSongUseCase } from "./domain/useCases/GetSongUseCase";
import OnPlayerClientConnectedUseCase, { DefaultOnPlayerClientConnectedUseCase } from "./domain/useCases/OnPlayerClientConnectedUseCase";
import ReservedSongRepository from "./data/repositories/ReservedSongRepository";
import SongRepository from "./data/repositories/SongRepository";
import SongDataSource from "./data/dataSources/SongDataSource";
import mongoose from "mongoose";
import ReservedSongDataSource from "./data/dataSources/ReservedSongDataSource";
import OnControllerClientConnectedUseCase, { DefaultOnControllerClientConnectedUseCase } from "./domain/useCases/OnControllerClientConnectedUseCase";
import OnPlayerClientFinishedPlayingUseCase, { DefaultOnPlayerClientFinishedPlayingUseCase } from "./domain/useCases/OnPlayerClientFinishedPlayingUseCase";
import OnControllerSongStopUseCase, { DefaultOnControllerSongStopUseCase } from "./domain/useCases/OnControllerSongStopUseCase";
const destinationPath = path.join(__dirname, 'static/songs');
if (fs.existsSync(directoryPath) && !fs.existsSync(destinationPath)) {
  fs.symlinkSync(directoryPath, destinationPath);
}


const karaokeManager: KaraokeManager = new DefaultKaraokeManager(directoryPath);
const openai: OpenAI = new OpenAI({
  apiKey: openAIKey,
});
var client: typeof mongoose | undefined;
const clientBuilder = async () => {
  if (!client) {
    client = await mongoose.connect(uri);
  }
  return client;
}

const karaokeRepository = new KaraokeDataSource(uri, directoryPath, karaokeManager, openai, socketIOServer);
const songRepository: SongRepository = new SongDataSource(uri, clientBuilder);
const reservedSongRepository: ReservedSongRepository = new ReservedSongDataSource(uri, clientBuilder);

export const expressApp = app;
export const socketServer = server;
export const socketIO = socketIOServer;
export const serverPort = parseInt(port) || 3000;
export const songsPath = destinationPath;

export const onPlayerClientConnectedUseCase: OnPlayerClientConnectedUseCase = new DefaultOnPlayerClientConnectedUseCase(reservedSongRepository);
export const onPlayerClientFinishedPlayingUseCase: OnPlayerClientFinishedPlayingUseCase = new DefaultOnPlayerClientFinishedPlayingUseCase(reservedSongRepository);
export const onControllerClientConnectedUseCase: OnControllerClientConnectedUseCase = new DefaultOnControllerClientConnectedUseCase(reservedSongRepository);
export const onControllerSongStopUseCase: OnControllerSongStopUseCase = new DefaultOnControllerSongStopUseCase(reservedSongRepository);
export const getSongListUseCase: GetSongListUseCase = new DefaultGetSongListUseCase(songRepository);
export const synchronizeRecordsUseCase: SynchronizeRecordsUseCase = new DefaultSynchronizeRecordsUseCase(karaokeRepository);
export const reserveSongUseCase: ReserveSongUseCase = new DefaultReserveSongUseCase(songRepository, reservedSongRepository);
export const getReservedSongListUseCase: GetReservedSongListUseCase = new DefaultGetReservedSongListUseCase(karaokeRepository);
export const restoreReservedSongsUseCase: RestoreReservedSongsUseCase = new DefaultRestoreReservedSongsUseCase(karaokeRepository);
export const generateServerQRUseCase: GenerateServerQRUseCase = new DefaultGenerateServerQRUseCase();
export const autoUpdateSongsUseCase: AutoUpdateSongsUseCase = new DefaultAutoUpdateSongsUseCase(karaokeRepository, openAISongPrompt);
export const removeReservedSongUseCase: RemoveReservedSongUseCase = new DefaultRemoveReservedSongUseCase(reservedSongRepository);
export const stopCurrentSongUseCase: StopCurrentSongUseCase = new DefaultStopCurrentSongUseCase(reservedSongRepository);
export const getSongWithIDUseCase: GetSongUseCase = new DefaultGetSongUseCase(songRepository);
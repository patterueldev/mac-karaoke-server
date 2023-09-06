import OpenAI from "openai";
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
import GetSongWithIDUseCase, { DefaultGetSongWithIDUseCase } from "./domain/useCases/GetSongWithIDUseCase";
const destinationPath = path.join(__dirname, 'static/songs');
if (fs.existsSync(directoryPath) && !fs.existsSync(destinationPath)) {
  fs.symlinkSync(directoryPath, destinationPath);
}


const karaokeManager: KaraokeManager = new DefaultKaraokeManager(directoryPath);
const openai: OpenAI = new OpenAI({
  apiKey: openAIKey,
});
const karaokeRepository = new KaraokeDataSource(uri, directoryPath, karaokeManager, openai);

export const serverPort = parseInt(port) || 3000;
export const songsPath = destinationPath;
export const getSongListUseCase: GetSongListUseCase = new DefaultGetSongListUseCase(karaokeRepository);
export const synchronizeRecordsUseCase: SynchronizeRecordsUseCase = new DefaultSynchronizeRecordsUseCase(karaokeRepository);
export const reserveSongUseCase: ReserveSongUseCase = new DefaultReserveSongUseCase(karaokeRepository);
export const getReservedSongListUseCase: GetReservedSongListUseCase = new DefaultGetReservedSongListUseCase(karaokeRepository);
export const restoreReservedSongsUseCase: RestoreReservedSongsUseCase = new DefaultRestoreReservedSongsUseCase(karaokeRepository);
export const generateServerQRUseCase: GenerateServerQRUseCase = new DefaultGenerateServerQRUseCase();
export const autoUpdateSongsUseCase: AutoUpdateSongsUseCase = new DefaultAutoUpdateSongsUseCase(karaokeRepository, openAISongPrompt);
export const removeReservedSongUseCase: RemoveReservedSongUseCase = new DefaultRemoveReservedSongUseCase(karaokeRepository);
export const stopCurrentSongUseCase: StopCurrentSongUseCase = new DefaultStopCurrentSongUseCase(karaokeRepository);
export const getSongWithIDUseCase: GetSongWithIDUseCase = new DefaultGetSongWithIDUseCase(karaokeRepository);
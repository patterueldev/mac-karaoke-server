import KaraokeManager, { DefaultKaraokeManager } from "./common/KaraokeManager";
import KaraokeDataSource from "./data/dataSources/KaraokeDataSource";
import GenerateServerQRUseCase, { DefaultGenerateServerQRUseCase } from "./domain/useCases/GenerateServerQRUseCase";
import GetReservedSongListUseCase, { DefaultGetReservedSongListUseCase } from "./domain/useCases/GetReservedSongListUseCase";
import GetSongListUseCase, { DefaultGetSongListUseCase } from "./domain/useCases/GetSongListUseCase";
import ReserveSongUseCase, { DefaultReserveSongUseCase } from "./domain/useCases/ReserveSongUseCase";
import RestoreReservedSongsUseCase, { DefaultRestoreReservedSongsUseCase } from "./domain/useCases/RestoreReservedSongsUseCase";
import SynchronizeRecordsUseCase, { DefaultSynchronizeRecordsUseCase } from "./domain/useCases/SynchronizeRecordsUseCase";

// Load environment variables
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Missing mongodb uri');
const directoryPath = process.env.DIRECTORY_PATH;
if (!directoryPath) throw new Error('Missing directory path');
const port = process.env.SERVER_PORT;
if (!port) throw new Error('Missing port');

const karaokeManager = new DefaultKaraokeManager(directoryPath);
const karaokeRepository = new KaraokeDataSource(uri, directoryPath, karaokeManager);

export const serverPort = port;
export const getSongListUseCase: GetSongListUseCase = new DefaultGetSongListUseCase(karaokeRepository);
export const synchronizeRecordsUseCase: SynchronizeRecordsUseCase = new DefaultSynchronizeRecordsUseCase(karaokeRepository);
export const reserveSongUseCase: ReserveSongUseCase = new DefaultReserveSongUseCase(karaokeRepository);
export const getReservedSongListUseCase: GetReservedSongListUseCase = new DefaultGetReservedSongListUseCase(karaokeRepository);
export const restoreReservedSongsUseCase: RestoreReservedSongsUseCase = new DefaultRestoreReservedSongsUseCase(karaokeRepository);
export const generateServerQRUseCase: GenerateServerQRUseCase = new DefaultGenerateServerQRUseCase();
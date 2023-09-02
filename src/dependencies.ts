import KaraokeDataSource from "./data/dataSources/KaraokeDataSource";
import { DefaultGetSongListUseCase } from "./domain/useCases/GetSongListUseCase";

// Load environment variables
const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('Missing mongodb uri');
const directoryPath = process.env.DIRECTORY_PATH;
if (!directoryPath) throw new Error('Missing directory path');

const karaokeRepository = new KaraokeDataSource(uri, directoryPath);

export const getSongListUseCase = new DefaultGetSongListUseCase(karaokeRepository);
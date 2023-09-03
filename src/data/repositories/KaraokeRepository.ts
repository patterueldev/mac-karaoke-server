import ReservedSong from "../../domain/entities/ReservedSong";
import ReservedSongRecord from "../../domain/entities/ReservedSongRecord";
import Song from "../../domain/entities/Song";
import SongRecord from "../../domain/entities/SongRecord";

export default interface KaraokeRepository {
  getSongRecords(limit?: number, filter?: string): Promise<SongRecord[]>;
  getSongFiles(): Promise<string[]>;
  createSongsFromFiles(files: string[]): Promise<Song[]>;
  getSongRecord(identifier: string): Promise<SongRecord>;
  reserveSong(record: SongRecord): Promise<void>;
  getQueue(): Promise<ReservedSong[]>;
  getReservedSongRecords(): Promise<ReservedSongRecord[]>;
  resumeQueue(): Promise<void>;
  getUnupdatedSongRecords(limit: number): Promise<SongRecord[]>;
  autoUpdateMetadataForSongs(filenames: string[], systemPrompt: string): Promise<Song[]>;
}
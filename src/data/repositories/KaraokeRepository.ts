import Song from "../../domain/entities/Song";
import SongRecord from "../../domain/entities/SongRecord";

export default interface KaraokeRepository {
  getSongRecords(): Promise<SongRecord[]>;
  getSongFiles(): Promise<string[]>;
  createSongsFromFiles(files: string[]): Promise<Song[]>;
  getSongRecord(identifier: string): Promise<SongRecord>;
  addToQueue(record: SongRecord): void;
  getQueue(): SongRecord[];
}
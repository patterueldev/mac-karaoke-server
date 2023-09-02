import SongRecord from "../../domain/entities/SongRecord";

export default interface KaraokeRepository {
  getSongRecords(): Promise<SongRecord[]>;
  getSongFiles(): Promise<string[]>;
  createSongsFromFiles(files: string[]): Promise<SongRecord[]>;
}
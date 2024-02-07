import Song from "../../domain/entities/Song";

export default interface SongRepository {
  createSongsFromFiles(files: string[]): Promise<Song[]>;
  createUpdateSongFromDownload(file: string, song: Song): Promise<Song>;
  getSongs(filter?: string, offset?: number, limit?: number): Promise<Song[]>;
  getSong(identifier: string): Promise<Song>;
  getUnupdatedSongs(limit?: number): Promise<Song[]>;
  updateMetadataForSongs(songs: Song[]): Promise<Song[]>;
  deleteSongRecords(files: string[]): Promise<void>;
}
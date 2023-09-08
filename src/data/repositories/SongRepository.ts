import Song from "../../domain/entities/Song";

export default interface SongRepository {
  createSongs(songs: Song[]): Promise<Song[]>;
  getSongs(filter?: string, offset?: number, limit?: number): Promise<Song[]>;
  getSong(identifier: string): Promise<Song>;
}
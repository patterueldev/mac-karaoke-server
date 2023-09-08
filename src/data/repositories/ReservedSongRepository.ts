import ReservedSong from "../../domain/entities/ReservedSong";
import Song from "../../domain/entities/Song";

export default interface ReservedSongRepository {
  // create
  createReservedSong(song: Song): Promise<ReservedSong>;
  // read
  getReservedSongs(): Promise<ReservedSong[]>;
  // update
  moveReservedSongInBetween(reservationId: string, beforeId?: string, afterId?: string): Promise<void>;
  // delete
  deleteReservedSong(reservationId: string): Promise<void>;
  shiftReservedSongList(): Promise<void>;
}
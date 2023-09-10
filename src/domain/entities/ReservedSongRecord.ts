import ReservedSong from "./ReservedSong";
import SongRecord from "./SongRecord";

export default interface ReservedSongRecord extends ReservedSong {
  songRecord: SongRecord;
  before?: ReservedSong;
  after?: ReservedSong;
  justReservedSong(): ReservedSong;
}

export function justReservedSong(reservedSongRecord: ReservedSongRecord): ReservedSong {
  const reservedSong: ReservedSong = {
    identifier: reservedSongRecord.identifier,
    song: reservedSongRecord.song
  };
  return reservedSong;
}
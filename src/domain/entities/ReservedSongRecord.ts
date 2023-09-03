import ReservedSong from "./ReservedSong";
import SongRecord from "./SongRecord";

export default interface ReservedSongRecord extends ReservedSong {
  songRecord: SongRecord;
  justReservedSong(): ReservedSong;
}

export function justReservedSong(reservedSongRecord: ReservedSongRecord): ReservedSong {
  const reservedSong: ReservedSong = {
    currentlyPlaying: reservedSongRecord.currentlyPlaying,
    identifier: reservedSongRecord.identifier,
    song: reservedSongRecord.song,
  };
  return reservedSong;
}
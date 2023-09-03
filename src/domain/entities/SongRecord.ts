import Song from "./Song";

export default interface SongRecord extends Song {
  file: string;
  justSong(): Song;
}

export function justSong(songRecord: SongRecord): Song {
  const song: Song = {
    identifier: songRecord.identifier,
    title: songRecord.title,
    artist: songRecord.artist,
    image: songRecord.image,
    containsLyrics: songRecord.containsLyrics,
    containsVoice: songRecord.containsVoice,
  };
  return song;
}
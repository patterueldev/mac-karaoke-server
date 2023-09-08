import Song from "./Song";

export default interface SongRecord extends Song {
  openAIUpdated: boolean;
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
    language: songRecord.language,
    localizations: songRecord.localizations,
    source: songRecord.source,
  };
  return song;
}
import Song from "./Song";

export default interface ReservedSong {
  identifier: string;
  currentlyPlaying: boolean;
  song: Song;
}
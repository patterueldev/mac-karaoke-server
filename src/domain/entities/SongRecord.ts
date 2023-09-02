import Song from "./Song";

export default interface SongRecord extends Song {
  file: string;
}
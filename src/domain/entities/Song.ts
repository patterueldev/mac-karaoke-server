import Localization from "./Localization";

export default interface Song {
  identifier: string;
  title: string;
  artist: string | undefined;
  image: string | undefined;
  containsLyrics: boolean;
  containsVoice: boolean;
  language: string | undefined;
  localizations: Localization[];
  source: string;
}
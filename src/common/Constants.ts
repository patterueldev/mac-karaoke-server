import { Lazy, lazyValue } from "./Lazy";

export default class Constants {
  static uri: Lazy<string> = lazyValue(() => {
    if (!process.env.MONGODB_URI) throw new Error('Missing mongodb uri');
    return process.env.MONGODB_URI;
  });

  static directoryPath: Lazy<string> = lazyValue(() => {
    if (!process.env.DIRECTORY_PATH) throw new Error('Missing directory path');
    return process.env.DIRECTORY_PATH;
  });

  static songFilePrompt: Lazy<string> = lazyValue(() => {
    if (!process.env.OPENAI_SONG_PROMPT) throw new Error('Missing openai song prompt');
    return process.env.OPENAI_SONG_PROMPT;
  });

  static videoMetadataPrompt: Lazy<string> = lazyValue(() => {
    if (!process.env.OPENAI_SONG_IDENTIFICATION_PROMPT) throw new Error('Missing openai video prompt');
    return process.env.OPENAI_SONG_IDENTIFICATION_PROMPT;
  });

  static openAIKey: Lazy<string> = lazyValue(() => {
    if (!process.env.OPENAI_API_KEY) throw new Error('Missing openai api key');
    return process.env.OPENAI_API_KEY;
  });

  static serverPort: Lazy<number> = lazyValue(() => {
    if (!process.env.SERVER_PORT) throw new Error('Missing port');
    return parseInt(process.env.SERVER_PORT) || 3000;
  });

  static youtubeAPIKey: Lazy<string> = lazyValue(() => {
    if (!process.env.YOUTUBE_API_KEY) throw new Error('Missing YouTube api key');
    return process.env.YOUTUBE_API_KEY;
  });
}
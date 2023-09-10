import { url } from 'inspector';
import OpenAI from "openai";
import Song from "../../domain/entities/Song";
import GenerativeAIRepository from "../repositories/GenerativeAIRepository";
import StreamingSiteMetadata from "../../domain/entities/StreamingSiteMetadata";

export default class GenerativeAIDataSource implements GenerativeAIRepository {
  private filesMetadataPrompt: string;
  private videoMetadataPrompt: string;
  private openai: OpenAI;

  constructor(openai: OpenAI, filesMetadataPrompt: string, videoMetadataPrompt: string) {
    this.openai = openai;
    this.filesMetadataPrompt = filesMetadataPrompt;
    this.videoMetadataPrompt = videoMetadataPrompt;
  }

  async generateMetadataForFiles(files: string[]): Promise<Song[]> {
    const body: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: this.filesMetadataPrompt,
        },
        {
          role: 'user',
          content: JSON.stringify(files),
        }
      ],
      max_tokens: 3000,
      temperature: 0.2,
    };
    console.log("openai request: ", JSON.stringify(body, null, 2)); // TODO: Erase this line
    const completion = await this.openai.chat.completions.create(body);
    let choices = completion.choices;
    let output = JSON.stringify(choices, null, 2);
    console.log("openai output: ", output); // TODO: Erase this line
    if (!choices || choices.length == 0) throw new Error('No choices found!');
    var content = choices[0].message.content;
    if (!content) throw new Error('No content found!');
    const result = JSON.parse(content);
    if (!result || !Array.isArray(result)) throw new Error('Invalid result!');

    var songs: Song[] = [];
    for (var i = 0; i < result.length; i++) {
      let raw = result[i];
      let song: Song = {
        identifier: raw.source,
        title: raw.title,
        artist: raw.artist,
        image: undefined,
        containsLyrics: true,
        containsVoice: false,
        language: raw.language,
        localizations: raw.localizations,
        source: raw.source,
      }
      songs.push(song);
    }
    return songs;
  }

  async generateMetadataForData(data: StreamingSiteMetadata, song?: Song): Promise<Song> {
    const body: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: this.videoMetadataPrompt,
        },
        {
          role: 'user',
          content: JSON.stringify(data),
        }
      ],
      max_tokens: 3000,
      temperature: 0.2,
    };
    console.log("openai request: ", JSON.stringify(body, null, 2)); // TODO: Erase this line
    const completion = await this.openai.chat.completions.create(body);
    let choices = completion.choices;
    let output = JSON.stringify(choices, null, 2);
    console.log("openai output: ", output); // TODO: Erase this line
    if (!choices || choices.length == 0) throw new Error('No choices found!');
    var content = choices[0].message.content;
    if (!content) throw new Error('No content found!');
    const result = JSON.parse(content);
    if (!result) throw new Error('Invalid result!');
    let raw = result;
    return {
      identifier: song?.identifier || data.url,
      title: raw.title,
      artist: raw.artist,
      image: data.thumbnail,
      containsLyrics: true,
      containsVoice: false,
      language: raw.language,
      localizations: raw.localizations,
      source: song?.source || data.url,
    }
  }
}
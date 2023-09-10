import OpenAI from "openai";
import Song from "../../domain/entities/Song";
import GenerativeAIRepository from "../repositories/GenerativeAIRepository";

export default class GenerativeAIDataSource implements GenerativeAIRepository {
  private systemPrompt: string;
  private openai: OpenAI;

  constructor(openai: OpenAI, systemPrompt: string) {
    this.openai = openai;
    this.systemPrompt = systemPrompt;
  }

  async generateMetadataForFiles(files: string[]): Promise<Song[]> {

    const body: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: this.systemPrompt,
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
}
import KaraokeRepository from "../../data/repositories/KaraokeRepository";
import Song from "../entities/Song";

export default interface AutoUpdateSongsUseCase {
  execute(limit: number): Promise<Song[]>;
}

export class DefaultAutoUpdateSongsUseCase {
  repository: KaraokeRepository;
  openAISongPrompt: string;

  constructor(repository: KaraokeRepository, openAISongPrompt: string) {
    this.repository = repository;
    this.openAISongPrompt = openAISongPrompt;
  }

  async execute(limit: number): Promise<Song[]> {
    const records = await this.repository.getUnupdatedSongRecords(limit);
    const filenames = records.map((record) => record.file);
    return await this.repository.autoUpdateMetadataForSongs(filenames, this.openAISongPrompt)
  }
}
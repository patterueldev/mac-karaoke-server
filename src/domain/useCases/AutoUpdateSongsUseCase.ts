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
    // let's loop this until unupdated songs are empty
    var records = await this.repository.getUnupdatedSongRecords(limit);
    var songsUpdated: Song[] = [];
    while (records.length > 0) {
      const filenames = records.map((record) => record.file);
      var songs = await this.repository.autoUpdateMetadataForSongs(filenames, this.openAISongPrompt);
      songsUpdated.push(...songs);
      records = await this.repository.getUnupdatedSongRecords(limit);
    }
    return songsUpdated;
  }
}
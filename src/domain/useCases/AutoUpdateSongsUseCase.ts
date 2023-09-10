import GenerativeAIRepository from "../../data/repositories/GenerativeAIRepository";
import KaraokeRepository from "../../data/repositories/KaraokeRepository";
import SongRepository from "../../data/repositories/SongRepository";
import Song from "../entities/Song";

export default interface AutoUpdateSongsUseCase {
  execute(limit: number): Promise<Song[]>;
}

export class DefaultAutoUpdateSongsUseCase {
  songRepository: SongRepository;
  generativeAIRepository: GenerativeAIRepository;
  
  constructor(songRepository: SongRepository, generativeAIRepository: GenerativeAIRepository) {
    this.songRepository = songRepository;
    this.generativeAIRepository = generativeAIRepository;
  }

  async execute(limit: number): Promise<Song[]> {
    // let's loop this until unupdated songs are empty
    var records = await this.songRepository.getUnupdatedSongs(limit);
    var songsUpdated: Song[] = [];
    while (records.length > 0) {
      const filenames = records.map((record) => record.source);
      let generated = await this.generativeAIRepository.generateMetadataForFiles(filenames);
      let songs = await this.songRepository.updateMetadataForSongs(generated);
      songsUpdated.push(...songs);
      records = await this.songRepository.getUnupdatedSongs(limit);
    }
    return songsUpdated;
  }
}
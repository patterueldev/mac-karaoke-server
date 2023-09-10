import GenerativeAIRepository from "../../data/repositories/GenerativeAIRepository";
import SongRepository from "../../data/repositories/SongRepository";
import StreamingSiteRepository from "../../data/repositories/StreamingSiteRepository";
import Song from "../entities/Song";

export default interface OptimizedSongDataUseCase {
  execute(id: string): Promise<Song>;
}

export class DefaultOptimizedSongDataUseCase implements OptimizedSongDataUseCase {
  songRepository: SongRepository;
  streamingSiteRepository: StreamingSiteRepository;
  generativeAIRepository: GenerativeAIRepository;

  constructor(songRepository: SongRepository, streamingSiteRepository: StreamingSiteRepository, generativeAIRepository: GenerativeAIRepository) {
    this.songRepository = songRepository;
    this.streamingSiteRepository = streamingSiteRepository;
    this.generativeAIRepository = generativeAIRepository;
  }

  async execute(id: string): Promise<Song> {
    console.log(`optimizing song for id: ${id}`);
    let song = await this.songRepository.getSong(id);
    let result = await this.streamingSiteRepository.getMetadataForSong(song);
    return await this.generativeAIRepository.generateMetadataForData(result, song);
  }
}

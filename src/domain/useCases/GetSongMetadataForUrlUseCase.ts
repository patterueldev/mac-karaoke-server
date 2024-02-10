import DownloadManager from "../../common/DownloadManager";
import GenerativeAIRepository from "../../data/repositories/GenerativeAIRepository";
import StreamingSiteRepository from "../../data/repositories/StreamingSiteRepository";
import Song from "../entities/Song";

export default interface GetSongMetadataForUrlUseCase {
  execute(url: string): Promise<Song>;
}

export class DefaultGetSongMetadataForUrlUseCase implements GetSongMetadataForUrlUseCase {
  streamingSiteRepository: StreamingSiteRepository;
  generativeAIRepository: GenerativeAIRepository;
  downloadManager: DownloadManager;

  constructor(streamingSiteRepository: StreamingSiteRepository, generativeAIRepository: GenerativeAIRepository, downloadManager: DownloadManager) {
    this.streamingSiteRepository = streamingSiteRepository;
    this.generativeAIRepository = generativeAIRepository;
    this.downloadManager = downloadManager;
  }

  async execute(url: string): Promise<Song> {
    try {
      console.log(`identifying song for url: ${url}`);
      let result = await this.streamingSiteRepository.getMetadataForUrl(url);
      let data = await this.generativeAIRepository.generateMetadataForData(result);
      this.downloadManager.cache(data);
      console.log(`identified song: ${JSON.stringify(data)}`);
      return data;
    } catch (error) {
      console.error(`error identifying song for url: ${url}`);
      console.error(error);
      throw error;
    }
  }
}
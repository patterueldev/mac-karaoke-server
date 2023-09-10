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
    console.log(`identifying song for url: ${url}`);
    let result = await this.streamingSiteRepository.getMetadataForUrl(url);
    // return {
    //   identifier: result.url,
    //   title: result.title || result.name,
    //   artist: result.artist,
    //   image: result.thumbnail,
    //   containsLyrics: true,
    //   containsVoice: true,
    //   language: undefined,
    //   localizations: [],
    //   source: result.name,
    // }
    let data = await this.generativeAIRepository.generateMetadataForData(result);
    this.downloadManager.cache(data);
    console.log(`identified song: ${JSON.stringify(data)}`);
    return data;
  }
}
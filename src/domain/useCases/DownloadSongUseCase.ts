import DownloadManager from "../../common/DownloadManager";
import SongRepository from "../../data/repositories/SongRepository";
import Song from "../entities/Song";

export default interface DownloadSongUseCase {
  execute(song: Song): Promise<Song>;
}

export class DefaultDownloadSongUseCase implements DownloadSongUseCase {
  downloadManager: DownloadManager;
  songRepository: SongRepository;

  constructor(downloadManager: DownloadManager, songRepository: SongRepository) {
    this.downloadManager = downloadManager;
    this.songRepository = songRepository;
  }

  async execute(song: Song): Promise<Song> {
    let filename = await this.downloadManager.download(song.source);
    return await this.songRepository.createUpdateSongFromDownload(filename, song);
  }
}
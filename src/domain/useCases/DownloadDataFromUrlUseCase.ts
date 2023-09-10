import DownloadManager from "../../common/DownloadManager";

export default interface DownloadDataFromUrlUseCase {
  execute(url: string): Promise<void>;
}

export class DefaultDownloadDataFromUrlUseCase implements DownloadDataFromUrlUseCase {
  downloadManager: DownloadManager;
  constructor(downloadManager: DownloadManager) {
    this.downloadManager = downloadManager;
  }

  async execute(url: string): Promise<void> {
    await this.downloadManager.download(url);
  }
}
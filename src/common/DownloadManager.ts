import ytdl from "ytdl-core";
import fs from "fs";
import Song from "../domain/entities/Song";

export default interface DownloadManager {
  cache(data: Song): Promise<void>;
  download(url: string): Promise<string>;
}

export class DefaultDownloadManager implements DownloadManager {
  ytdl: typeof ytdl;
  fs: typeof fs;
  directoryPath: string;

  constructor(downloader: typeof ytdl, fileSystem: typeof fs, directoryPath: string) {
    this.ytdl = downloader;
    this.fs = fileSystem;
    this.directoryPath = directoryPath;
  }

  songs: Song[] = [];

  async cache(data: Song): Promise<void> {
    this.songs.push(data);
  }

  async download(url: string): Promise<string> {
    let info = await ytdl.getInfo(url)
    let videoId = info.player_response.videoDetails.videoId
    let fileTitle = this.convertToFileSupportedName(info.player_response.videoDetails.title)
    let filename = `${fileTitle} [${videoId}].mp4`;
    let directory = this.directoryPath;
    let path = `${directory}/${filename}`;
    let options: ytdl.downloadOptions = { filter: 'videoandaudio' };
    let readable = ytdl.downloadFromInfo(info, options)
    readable.on('progress', (chunkLength, downloaded, total) => {
      console.log(`downloading... ${downloaded/total}`)
    });
    readable.on('end', () => {
      console.log('done...')
      console.log("Successfully saved to " + path)
      console.log("Filename: " + filename)
    })
    try {
      console.log("Saving to " + path)
      readable.pipe(fs.createWriteStream(path));
    } catch(error) {
      console.log("Failed to save to " + path)
      console.log("Filename: " + filename)
      console.log(error)
    }
    return filename;
  }

  private convertToFileSupportedName(name: string): string {
    return name.replace(/[/\\?%*:|"<>]/g, '-');
  }
}
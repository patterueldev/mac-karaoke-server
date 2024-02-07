import DownloadManager from "../../common/DownloadManager";
import FileRepository from "../../data/repositories/FileRepository";
import KaraokeRepository from "../../data/repositories/KaraokeRepository"
import SongRepository from "../../data/repositories/SongRepository";
import Song from "../entities/Song";

export default interface SynchronizeRecordsUseCase {
  execute(): Promise<void>
}

export class DefaultSynchronizeRecordsUseCase implements SynchronizeRecordsUseCase {
  fileRepository: FileRepository;
  songRepository: SongRepository;
  downloadManager: DownloadManager;

  constructor(fileRepository: FileRepository, songRepository: SongRepository, downloadManager: DownloadManager) {
    this.fileRepository = fileRepository
    this.songRepository = songRepository
    this.downloadManager = downloadManager
  }

  async execute(): Promise<void> {
    // first, get the list of files
    let files = await this.fileRepository.getFileList();
    // filter only video files
    // file types: mp4, mkv, avi, webm, mov
    let videoFiles = files.filter((file) => {
      const fileExtension = file.split('.').pop();
      if (!fileExtension) return false;
      return ['mp4', 'mkv', 'avi', 'webm', 'mov'].includes(fileExtension);
    }); 

    // then, get the list of records
    var records = await this.songRepository.getSongs();
    // most likely the records' file property will be unique
    // so, let's filter the files that are still not in the records
    var filesToRecord = videoFiles.filter((file) => {
      return !records.some((record) => {
        return record.source == file;
      });
    });
    await this.songRepository.createSongsFromFiles(filesToRecord);

    // then, get the list of records again
    records = await this.songRepository.getSongs();
    // let's check each record if the file still exists
    var songFilesNotExist = records.filter((record) => {
      return !videoFiles.includes(record.source);
    });
    console.log("The following files are not found in the file system: ", songFilesNotExist.map((file) => file.source));
    // let's try downloading the file from the youtube. the id is encased on the filename e.g. "***[youtube-id].mp4"
    // for (let song of songFilesNotExist) {
    //   let youtubeId = song.source.match(/\[([^[]*)]\.mp4$/);
    //   if (youtubeId) {
    //     let videoId = youtubeId[1];
    //     let url = `https://www.youtube.com/watch?v=${videoId}`;
    //     console.log("Downloading from ", url);
    //     // try {
    //     //   let filename = await this.downloadManager.download(url);
    //     //   await this.songRepository.createUpdateSongFromDownload(filename, song);
    //     //   console.log("Downloaded and created record for ", filename);
    //     // } catch (error) {
    //     //   console.error("Failed to download from ", url);
    //     //   console.error(error);
    //     // }
    //   }
    // }

    // if not, remove the record
    // await this.songRepository.deleteSongRecords(songFilesNotExist.map((file) => file.source));
  }
}
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

  constructor(fileRepository: FileRepository, songRepository: SongRepository) {
    this.fileRepository = fileRepository
    this.songRepository = songRepository
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
    let records = await this.songRepository.getSongs();
    // most likely the records' file property will be unique
    // so, let's filter the files that are still not in the records
    var filesToRecord = videoFiles.filter((file) => {
      return !records.some((record) => {
        return record.source == file;
      });
    });
    await this.songRepository.createSongsFromFiles(filesToRecord);
  }
}
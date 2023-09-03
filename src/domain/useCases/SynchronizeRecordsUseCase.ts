import KaraokeRepository from "../../data/repositories/KaraokeRepository"

export default interface SynchronizeRecordsUseCase {
  execute(): Promise<void>
}

export class DefaultSynchronizeRecordsUseCase implements SynchronizeRecordsUseCase {
  repository: KaraokeRepository;

  constructor (repository: KaraokeRepository) {
    this.repository = repository
  }

  async execute(): Promise<void> {
    // first, get the list of files
    var files = await this.repository.getSongFiles();
    // then, get the list of records
    var records = await this.repository.getSongRecords();
    // most likely the records' file property will be unique
    // so, let's filter the files that are still not in the records
    var filesToRecord = files.filter((file) => {
      return !records.some((record) => {
        return record.file == file;
      });
    });

    // now, we have the list of records to create; let's create them
    await this.repository.createSongsFromFiles(filesToRecord);
  }
}
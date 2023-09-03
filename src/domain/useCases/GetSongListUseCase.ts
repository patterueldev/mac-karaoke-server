import KaraokeRepository from "../../data/repositories/KaraokeRepository";
import Song from "../entities/Song";

export default interface GetSongListUseCase {
  execute(): Promise<Song[]>
}

export class DefaultGetSongListUseCase implements GetSongListUseCase {
  repository: KaraokeRepository;
  constructor(repository: KaraokeRepository) {
    this.repository = repository;
  }
  async execute() : Promise<Song[]> {
    // first, get the list of files
    var files = await this.repository.getSongFiles();

    // then, get the list of records
    var records = await this.repository.getSongRecords();

    // // then, merge the two lists
    // // essentially, the filter and map the records whose `file` property is in the list of files
    var filtered = records.filter((record) => {
      return files.includes(record.file);
    });

    // discard the unnecessary properties that are not in the Song interface
    var songs = filtered.map((record) => {
      return record.justSong();
    });
    return songs;
  }
}
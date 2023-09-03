import KaraokeRepository from "../../data/repositories/KaraokeRepository";
import Song from "../entities/Song";

export default interface GetReservedSongListUseCase {
  execute(): Promise<Song[]>;
}

export class DefaultGetReservedSongListUseCase implements GetReservedSongListUseCase {
  repository: KaraokeRepository;

  constructor(repository: KaraokeRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Song[]> {
    return this.repository.getQueue();
  }
}
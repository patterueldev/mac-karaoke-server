import KaraokeRepository from "../../data/repositories/KaraokeRepository";
import ReservedSong from "../entities/ReservedSong";
import Song from "../entities/Song";

export default interface GetReservedSongListUseCase {
  execute(): Promise<ReservedSong[]>;
}

export class DefaultGetReservedSongListUseCase implements GetReservedSongListUseCase {
  repository: KaraokeRepository;

  constructor(repository: KaraokeRepository) {
    this.repository = repository;
  }

  async execute(): Promise<ReservedSong[]> {
    return this.repository.getQueue();
  }
}
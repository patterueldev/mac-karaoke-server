import KaraokeRepository from "../../data/repositories/KaraokeRepository";
import ReservedSongRepository from "../../data/repositories/ReservedSongRepository";
import ReservedSong from "../entities/ReservedSong";
import Song from "../entities/Song";

export default interface GetReservedSongListUseCase {
  execute(): Promise<ReservedSong[]>;
}

export class DefaultGetReservedSongListUseCase implements GetReservedSongListUseCase {
  repository: ReservedSongRepository;

  constructor(repository: ReservedSongRepository) {
    this.repository = repository;
  }

  async execute(): Promise<ReservedSong[]> {
    return this.repository.getReservedSongs();
  }
}
import KaraokeRepository from "../../data/repositories/KaraokeRepository";
import Song from "../entities/Song";

export default interface GetSongWithIDUseCase {
  execute(id: string): Promise<Song>;
}

export class DefaultGetSongWithIDUseCase implements GetSongWithIDUseCase {
  karaokeRepository: KaraokeRepository;
  constructor(karaokeRepository: KaraokeRepository) {
    this.karaokeRepository = karaokeRepository;
  }

  async execute(id: string): Promise<Song> {
    return await this.karaokeRepository.getSongRecord(id);
  }
}
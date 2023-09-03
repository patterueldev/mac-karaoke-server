import KaraokeRepository from "../../data/repositories/KaraokeRepository";
import Song from "../entities/Song";

export default interface ReserveSongUseCase {
  execute(identifier: string): Promise<Song>
}

export class DefaultReserveSongUseCase implements ReserveSongUseCase {
  repository: KaraokeRepository;
  constructor(repository: KaraokeRepository) {
    this.repository = repository;
  }
  async execute(identifier: string) : Promise<Song> {
    // return this.repository.reserveSong(identifier);

    const record = await this.repository.getSongRecord(identifier);
    this.repository.reserveSong(record);
    return record;
  }
}
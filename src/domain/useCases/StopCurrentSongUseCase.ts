import KaraokeRepository from "../../data/repositories/KaraokeRepository";
import ReservedSongRepository from "../../data/repositories/ReservedSongRepository";

export default interface StopCurrentSongUseCase {
  execute(): Promise<void>;
}

export class DefaultStopCurrentSongUseCase implements StopCurrentSongUseCase {
  reservedSongRepository: ReservedSongRepository;
  constructor(reservedSongRepository: ReservedSongRepository) {
    this.reservedSongRepository = reservedSongRepository;
  }
  
  async execute(): Promise<void> {
      await this.reservedSongRepository.shiftReservedSongList();
  }
}
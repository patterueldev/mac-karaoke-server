import KaraokeRepository from "../../data/repositories/KaraokeRepository";

export default interface RemoveReservedSongUseCase {
  execute(reservationId: string): Promise<void>;
}

export class DefaultRemoveReservedSongUseCase {
  karaokeRepository: KaraokeRepository;

  constructor(karaokeRepository: KaraokeRepository) {
    this.karaokeRepository = karaokeRepository;
  }

  async execute(reservationId: string): Promise<void> {
    await this.karaokeRepository.removeReservedSong(reservationId);
  }
}
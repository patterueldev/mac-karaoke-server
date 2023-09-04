import KaraokeRepository from "../../data/repositories/KaraokeRepository";

export default interface StopCurrentSongUseCase {
  execute(): Promise<void>;
}

export class DefaultStopCurrentSongUseCase implements StopCurrentSongUseCase {
  karaokeRepository: KaraokeRepository;
  constructor(karaokeRepository: KaraokeRepository) {
    this.karaokeRepository = karaokeRepository;
  }
  
  async execute(): Promise<void> {
      await this.karaokeRepository.stopCurrentSong();
  }
}
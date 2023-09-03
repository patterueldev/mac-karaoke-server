import KaraokeRepository from "../../data/repositories/KaraokeRepository";

export default interface RestoreReservedSongsUseCase {
  execute(): Promise<void>;
}

export class DefaultRestoreReservedSongsUseCase implements RestoreReservedSongsUseCase {
  private repository: KaraokeRepository;

  constructor(repository: KaraokeRepository) {
    this.repository = repository;
  }

  async execute(): Promise<void> {
    this.repository.resumeQueue();
  }
}
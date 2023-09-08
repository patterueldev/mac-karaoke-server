import ReservedSongRepository from "../../data/repositories/ReservedSongRepository";

export default interface RemoveReservedSongUseCase {
  execute(id: string): Promise<void>;
}

export class DefaultRemoveReservedSongUseCase {
  reservedSongRepository: ReservedSongRepository;

  constructor(reservedSongRepository: ReservedSongRepository) {
    this.reservedSongRepository = reservedSongRepository;
  }

  async execute(id: string): Promise<void> {
    console.log(`Removing reserved song with id: ${id}`);
    await this.reservedSongRepository.deleteReservedSong(id);
  }
} 
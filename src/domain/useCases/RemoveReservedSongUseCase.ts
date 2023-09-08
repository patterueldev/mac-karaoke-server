import EmitterManager from "../../common/EmitterManager";
import { Event } from "../../common/Event";
import ReservedSongRepository from "../../data/repositories/ReservedSongRepository";

export default interface RemoveReservedSongUseCase {
  execute(id: string): Promise<void>;
}

export class DefaultRemoveReservedSongUseCase {
  reservedSongRepository: ReservedSongRepository;
  emitterManager: EmitterManager;

  constructor(reservedSongRepository: ReservedSongRepository, emitterManager: EmitterManager) {
    this.reservedSongRepository = reservedSongRepository;
    this.emitterManager = emitterManager;
  }

  async execute(id: string): Promise<void> {
    console.log(`Removing reserved song with id: ${id}`);
    await this.reservedSongRepository.deleteReservedSong(id);
    let reserved = await this.reservedSongRepository.getReservedSongs();
    this.emitterManager.emitToAll(Event.ReservedSongListUpdated, reserved);
  }
} 
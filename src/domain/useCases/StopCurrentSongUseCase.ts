import EmitterManager from "../../common/EmitterManager";
import { Event } from "../../common/Event";
import KaraokeRepository from "../../data/repositories/KaraokeRepository";
import ReservedSongRepository from "../../data/repositories/ReservedSongRepository";

export default interface StopCurrentSongUseCase {
  execute(): Promise<void>;
}

export class DefaultStopCurrentSongUseCase implements StopCurrentSongUseCase {
  reservedSongRepository: ReservedSongRepository;
  emitterManager: EmitterManager;
  
  constructor(reservedSongRepository: ReservedSongRepository, emitterManager: EmitterManager) {
    this.reservedSongRepository = reservedSongRepository;
    this.emitterManager = emitterManager;
  }
  
  async execute(): Promise<void> {
      await this.reservedSongRepository.shiftReservedSongList();

      (async () => {
        let reserved = await this.reservedSongRepository.getReservedSongs()
        this.emitterManager.emitToAll(Event.ReservedSongListUpdated, reserved);
        if(reserved.length > 0) {
          this.emitterManager.emitToPlayer(Event.PlayerClientPlay, reserved[0]);
        } else {
          this.emitterManager.emitToPlayer(Event.PlayerClientStop);
        }
      });
  }
}
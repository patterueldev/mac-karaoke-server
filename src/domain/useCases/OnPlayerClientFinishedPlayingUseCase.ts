import { EventEmitter } from "stream";
import ReservedSongRepository from "../../data/repositories/ReservedSongRepository";
import { Event } from "../../common/Event";
import EmitterManager from "../../common/EmitterManager";

export default interface OnPlayerClientFinishedPlayingUseCase {
  execute(): Promise<void>;
}

export class DefaultOnPlayerClientFinishedPlayingUseCase implements OnPlayerClientFinishedPlayingUseCase {
  reservedSongRepository: ReservedSongRepository;
  emitterManager: EmitterManager;

  constructor(reservedSongRepository: ReservedSongRepository, emitterManager: EmitterManager) {
    this.reservedSongRepository = reservedSongRepository;
    this.emitterManager = emitterManager;
  }

  async execute(): Promise<void> {
      // stop current song and shift reserved song list
      await this.reservedSongRepository.shiftReservedSongList();

      let reserved = await this.reservedSongRepository.getReservedSongs();

      // send play command to player
      this.emitterManager.emitToAll(Event.ReservedSongListUpdated, reserved);
      if (reserved.length > 0) {
        this.emitterManager.emitToPlayer(Event.PlayerClientPlay, reserved[0]);
      }
  }
}
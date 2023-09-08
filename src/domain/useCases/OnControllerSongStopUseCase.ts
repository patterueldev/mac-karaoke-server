import EventEmitter from "events";
import ReservedSongRepository from "../../data/repositories/ReservedSongRepository";
import { Event } from "../../common/Event";
import EmitterManager from "../../common/EmitterManager";

export default interface OnControllerSongStopUseCase {
  execute(): Promise<void>;
}

export class DefaultOnControllerSongStopUseCase implements OnControllerSongStopUseCase {
  reservedSongRepository: ReservedSongRepository;
  emitterManager: EmitterManager;

  constructor(reservedSongRepository: ReservedSongRepository, emitterManager: EmitterManager) {
    this.reservedSongRepository = reservedSongRepository;
    this.emitterManager = emitterManager;
  }
  
  async execute(): Promise<void> {
    // stop current song and shift reserved song list
    await this.reservedSongRepository.shiftReservedSongList();

    let reserved = await this.reservedSongRepository.getReservedSongs()
    this.emitterManager.emitToAll(Event.ReservedSongListUpdated, reserved);

    // send play command to player
    if (reserved.length > 0) {
      this.emitterManager.emitToPlayer(Event.PlayerClientPlay, reserved[0]);
    }
  }
}
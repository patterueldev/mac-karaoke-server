import EventEmitter from "events";
import ReservedSongRepository from "../../data/repositories/ReservedSongRepository";
import { Event } from "../../common/Event";
import EmitterManager from "../../common/EmitterManager";

export default interface OnControllerClientConnectedUseCase {
  execute(playerClientEmitter?: EventEmitter): Promise<void>;
}

export class DefaultOnControllerClientConnectedUseCase implements OnControllerClientConnectedUseCase {
  reservedSongRepository: ReservedSongRepository;
  emitterManager: EmitterManager;

  constructor(reservedSongRepository: ReservedSongRepository, emitterManager: EmitterManager) {
    this.reservedSongRepository = reservedSongRepository;
    this.emitterManager = emitterManager;
  }

  async execute(clientEmitter: EventEmitter): Promise<void> {
    this.emitterManager.addControllerEmitter(clientEmitter);
    let reserved = await this.reservedSongRepository.getReservedSongs()
    clientEmitter.emit(Event.ReservedSongListUpdated, reserved);
  }
}
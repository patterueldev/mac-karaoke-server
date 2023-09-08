import { EventEmitter } from 'stream';
import { Event } from '../../common/Event';
import ReservedSongRepository from '../../data/repositories/ReservedSongRepository';
import EmitterManager from '../../common/EmitterManager';
export default interface OnPlayerClientConnectedUseCase {
  execute(clientEmitter: EventEmitter): Promise<void>;
}

export class DefaultOnPlayerClientConnectedUseCase implements OnPlayerClientConnectedUseCase {
  reservedSongRepository: ReservedSongRepository;
  emitterManager: EmitterManager;

  constructor(reservedSongRepository: ReservedSongRepository, emitterManager: EmitterManager) {
    this.reservedSongRepository = reservedSongRepository;
    this.emitterManager = emitterManager;
  }

  async execute(clientEmitter: EventEmitter): Promise<void> {
    this.emitterManager.setupPlayerEmitter(clientEmitter);
    let reserved = await this.reservedSongRepository.getReservedSongs()
    clientEmitter.emit(Event.ReservedSongListUpdated, reserved);
    if (reserved.length > 0) {
      clientEmitter.emit(Event.PlayerClientPlay, reserved[0]);
    }
  }
}
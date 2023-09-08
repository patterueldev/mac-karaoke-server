import { EventEmitter } from 'stream';
import { Event } from '../../common/Event';
import ReservedSongRepository from '../../data/repositories/ReservedSongRepository';
export default interface OnPlayerClientConnectedUseCase {
  execute(clientEmitter: EventEmitter): Promise<void>;
}

export class DefaultOnPlayerClientConnectedUseCase implements OnPlayerClientConnectedUseCase {
  reservedSongRepository: ReservedSongRepository;

  constructor(reservedSongRepository: ReservedSongRepository) {
    this.reservedSongRepository = reservedSongRepository;
  }

  async execute(clientEmitter: EventEmitter): Promise<void> {
    let reserved = await this.reservedSongRepository.getReservedSongs()
    clientEmitter.emit(Event.ReservedSongListUpdated, reserved);
    if (reserved.length > 0) {
      clientEmitter.emit(Event.PlayerClientPlay, reserved[0]);
    }
  }
}
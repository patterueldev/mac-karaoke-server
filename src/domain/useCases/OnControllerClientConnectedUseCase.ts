import EventEmitter from "events";
import ReservedSongRepository from "../../data/repositories/ReservedSongRepository";
import { Event } from "../../common/Event";

export default interface OnControllerClientConnectedUseCase {
  execute(playerClientEmitter?: EventEmitter): Promise<void>;
}

export class DefaultOnControllerClientConnectedUseCase implements OnControllerClientConnectedUseCase {
  reservedSongRepository: ReservedSongRepository;

  constructor(reservedSongRepository: ReservedSongRepository) {
    this.reservedSongRepository = reservedSongRepository;
  }

  async execute(clientEmitter: EventEmitter): Promise<void> {
    let reserved = await this.reservedSongRepository.getReservedSongs()
    clientEmitter.emit(Event.ReservedSongListUpdated, reserved);
  }
}
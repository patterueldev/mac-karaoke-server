import EventEmitter from "events";
import ReservedSongRepository from "../../data/repositories/ReservedSongRepository";
import { Event } from "../../common/Event";

export default interface OnControllerSongStopUseCase {
  execute(controllerEmitter: EventEmitter, playerEmitter?: EventEmitter | undefined): Promise<void>;
}

export class DefaultOnControllerSongStopUseCase implements OnControllerSongStopUseCase {
  reservedSongRepository: ReservedSongRepository;

  constructor(reservedSongRepository: ReservedSongRepository) {
    this.reservedSongRepository = reservedSongRepository;
  }
  
  async execute(controllerEmitter: EventEmitter, playerEmitter?: EventEmitter | undefined): Promise<void> {
    // stop current song and shift reserved song list
    await this.reservedSongRepository.shiftReservedSongList();

    let reserved = await this.reservedSongRepository.getReservedSongs()

    controllerEmitter.emit(Event.ReservedSongListUpdated, reserved);
    playerEmitter?.emit(Event.ReservedSongListUpdated, reserved);

    // send play command to player
    if (reserved.length > 0) {
      playerEmitter?.emit(Event.PlayerClientPlay, reserved[0]);
    }
  }
}
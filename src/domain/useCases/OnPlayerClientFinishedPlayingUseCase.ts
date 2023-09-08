import { EventEmitter } from "stream";
import ReservedSongRepository from "../../data/repositories/ReservedSongRepository";
import { Event } from "../../common/Event";

export default interface OnPlayerClientFinishedPlayingUseCase {
  execute(playerEmitter: EventEmitter, controllerEmitter?: EventEmitter): Promise<void>;
}

export class DefaultOnPlayerClientFinishedPlayingUseCase implements OnPlayerClientFinishedPlayingUseCase {
  reservedSongRepository: ReservedSongRepository;

  constructor(reservedSongRepository: ReservedSongRepository) {
    this.reservedSongRepository = reservedSongRepository;
  }

  async execute(playerEmitter: EventEmitter, controllerEmitter?: EventEmitter | undefined): Promise<void> {
      // stop current song and shift reserved song list
      await this.reservedSongRepository.shiftReservedSongList();

      let reserved = await this.reservedSongRepository.getReservedSongs();

      // send play command to player
      controllerEmitter?.emit(Event.ReservedSongListUpdated, reserved);
      playerEmitter.emit(Event.ReservedSongListUpdated, reserved);
      if (reserved.length > 0) {
        playerEmitter.emit(Event.PlayerClientPlay, reserved[0]);
      }
  }
}
import EmitterManager from "../../common/EmitterManager";
import { Event } from "../../common/Event";
import KaraokeRepository from "../../data/repositories/KaraokeRepository";
import ReservedSongRepository from "../../data/repositories/ReservedSongRepository";
import SongRepository from "../../data/repositories/SongRepository";
import Song from "../entities/Song";

export default interface ReserveSongUseCase {
  execute(identifier: string): Promise<Song>
}

export class DefaultReserveSongUseCase implements ReserveSongUseCase {
  songRepository: SongRepository;
  reservedSongRepository: ReservedSongRepository;
  emitterManager: EmitterManager;
  
  constructor(songRepository: SongRepository, reservedSongRepository: ReservedSongRepository, emitterManager: EmitterManager) {
    this.songRepository = songRepository;
    this.reservedSongRepository = reservedSongRepository;
    this.emitterManager = emitterManager;
  }
  async execute(identifier: string) : Promise<Song> {
    const record = await this.songRepository.getSong(identifier);
    let reserved = await this.reservedSongRepository.createReservedSong(record);
    (async () => {
      let queued = await this.reservedSongRepository.getReservedSongs();
      console.log('Reserved song list updated! ' + queued.length + ' songs in queue.')
      this.emitterManager.emitToAll(Event.ReservedSongListUpdated, queued);
      if (queued.length === 1) {
        console.log('Playing first song in queue...')
        this.emitterManager.emitToPlayer(Event.PlayerClientPlay, reserved);
      }
    })();
    return record;
  }
}
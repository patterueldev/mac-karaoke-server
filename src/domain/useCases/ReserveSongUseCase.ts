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
    await this.reservedSongRepository.createReservedSong(record);
    let reserved = await this.reservedSongRepository.getReservedSongs();
    this.emitterManager.emitToAll(Event.ReservedSongListUpdated, reserved);
    return record;
  }
}
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
  constructor(songRepository: SongRepository, reservedSongRepository: ReservedSongRepository) {
    this.songRepository = songRepository;
    this.reservedSongRepository = reservedSongRepository;
  }
  async execute(identifier: string) : Promise<Song> {
    // return this.repository.reserveSong(identifier);

    const record = await this.songRepository.getSong(identifier);
    this.reservedSongRepository.createReservedSong(record);
    return record;
  }
}
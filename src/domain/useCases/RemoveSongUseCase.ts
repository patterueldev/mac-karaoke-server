import { resolve } from "path";
import EmitterManager from "../../common/EmitterManager";
import { Event } from "../../common/Event";
import SongRepository from "../../data/repositories/SongRepository";
import ReservedSongRepository from "../../data/repositories/ReservedSongRepository";

export default interface RemoveSongUseCase {
  execute(id: string): Promise<void>;
}

export class DefaultRemoveSongUseCase {
  songRepository: SongRepository;
  reservedSongRepository: ReservedSongRepository;

  constructor(songRepository: SongRepository, reservedSongRepository: ReservedSongRepository) {
    this.songRepository = songRepository;
    this.reservedSongRepository = reservedSongRepository;
  }

  async execute(id: string): Promise<void> {
    // first, check if the song is reserved
    const reservedSongs = await this.reservedSongRepository.getReservedSongs();
    const reservedSong = reservedSongs.find((song) => song.song.identifier === id);
    if (reservedSong) {
      throw new Error(`Song with id: ${id} is reserved`);
    }
    console.log(`Removing song with id: ${id}`);
    await this.songRepository.deleteSongRecord(id);
  }
} 
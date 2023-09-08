import SongRepository from "../../data/repositories/SongRepository";
import Song from "../entities/Song";

export default interface GetSongUseCase {
  execute(id: string): Promise<Song>;
}

export class DefaultGetSongUseCase implements GetSongUseCase {
  songRepository: SongRepository;
  constructor(songRepository: SongRepository) {
    this.songRepository = songRepository;
  }

  async execute(id: string): Promise<Song> {
    return await this.songRepository.getSong(id);
  }
}
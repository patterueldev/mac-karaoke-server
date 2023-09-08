import SongRepository from "../../data/repositories/SongRepository";
import Song from "../entities/Song";

export default interface GetSongListUseCase {
  execute(filter?: string, offset?: number, limit?: number): Promise<Song[]>
}

export class DefaultGetSongListUseCase implements GetSongListUseCase {
  songRepository: SongRepository;

  constructor(songRepository: SongRepository) {
    this.songRepository = songRepository;
  }

  async execute(filter?: string, offset?: number, limit?: number) : Promise<Song[]> {
    // then, get the list of records
    return await this.songRepository.getSongs(filter, offset, limit);
  }
}
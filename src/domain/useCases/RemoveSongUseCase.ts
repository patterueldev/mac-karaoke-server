import { resolve } from "path";
import EmitterManager from "../../common/EmitterManager";
import { Event } from "../../common/Event";
import SongRepository from "../../data/repositories/SongRepository";

export default interface RemoveSongUseCase {
  execute(id: string): Promise<void>;
}

export class DefaultRemoveSongUseCase {
  songRepository: SongRepository;

  constructor(songRepository: SongRepository) {
    this.songRepository = songRepository;
  }

  async execute(id: string): Promise<void> {
    console.log(`Removing reserved song with id: ${id}`);
    await this.songRepository.deleteSongRecord(id);
  }
} 
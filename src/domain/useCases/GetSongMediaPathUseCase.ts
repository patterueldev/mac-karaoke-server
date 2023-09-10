import fs from "fs";
import path from "path";
import SongRepository from "../../data/repositories/SongRepository";

export default interface GetSongMediaPathUseCase {
  execute(songID: string): Promise<string>;
}

export class DefaultGetSongMediaPathUseCase implements GetSongMediaPathUseCase {
  songRepository: SongRepository;
  directoryPath: string;

  constructor(songRepository: SongRepository, directoryPath: string) {
    this.songRepository = songRepository;
    this.directoryPath = directoryPath;
  }

  private mediaPath(): string {
    const rootDir = process.cwd();
    let destinationPath = path.join(rootDir, 'src/static/songs')
    if (fs.existsSync(this.directoryPath) && !fs.existsSync(destinationPath)) {
      fs.symlinkSync(this.directoryPath, destinationPath);
    }
    return destinationPath;
  }
  
  async execute(songID: string): Promise<string> {
    const record = await this.songRepository.getSong(songID);
    const filename = record.source;
    let songsPath = this.mediaPath();
    return `${songsPath}/${filename}`;
  }
}
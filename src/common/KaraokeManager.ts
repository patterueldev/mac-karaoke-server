import SongRecord from "../domain/entities/SongRecord";
import { exec } from "child_process";

export default class KaraokeManager {
  private reservedSongs: SongRecord[] = [];

  private directoryPath: string;
  private vlcCli: string;

  constructor(directoryPath: string, vlcCli: string = 'vlc') {
    this.directoryPath = directoryPath;
    this.vlcCli = vlcCli;
  }

  async addToQueue(song: SongRecord) {
    this.reservedSongs.push(song);
    
    if(this.reservedSongs.length == 1) {
      await this.playNext();
    }
  }

  private async playNext() {
    if (this.reservedSongs.length == 0) {
      return;
    }
    
    const file = this.reservedSongs[0].file;
    const vlcCommand = `${this.vlcCli} "${this.directoryPath}/${file}" --fullscreen vlc://quit`;
    
    await this.executeCommand(vlcCommand)
    this.reservedSongs.shift();
    await this.playNext();
  }

  private async executeCommand(command: string) {
    var promise = new Promise<void>((resolve, reject) => {
      exec(command, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
    await promise;
  }
}
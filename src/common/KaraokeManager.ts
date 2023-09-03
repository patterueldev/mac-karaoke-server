import { Mongoose } from "mongoose";
import ReservedSong from "../domain/entities/ReservedSong";
import ReservedSongRecord from "../domain/entities/ReservedSongRecord";
import SongRecord from "../domain/entities/SongRecord";
import { exec } from "child_process";

export default interface KaraokeManager {
  delegate: KaraokeDelegate | undefined;
  playNext(): Promise<void>;
}

export interface KaraokeDelegate {
  getReservedSongRecords(): Promise<ReservedSongRecord[]>;
  shiftReservedSongs(): Promise<void>;
}


export class DefaultKaraokeManager implements KaraokeManager {
  delegate: KaraokeDelegate | undefined;
  
  private directoryPath: string;
  private vlcCli: string;

  constructor(directoryPath: string, vlcCli: string = 'vlc') {
    this.directoryPath = directoryPath;
    this.vlcCli = vlcCli;
  }

  // Private methods
  async playNext(): Promise<void> {
    const reservedSongs = await this.delegate?.getReservedSongRecords() ?? [];
    if (reservedSongs.length == 0) {
      return;
    }
    
    const songRecord = reservedSongs[0].songRecord;
    const file = songRecord.file;
    const vlcCommand = `${this.vlcCli} "${this.directoryPath}/${file}" --fullscreen vlc://quit`;
    
    await this.executeCommand(vlcCommand)
    await this.delegate?.shiftReservedSongs();
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
import { Mongoose } from "mongoose";
import ReservedSong from "../domain/entities/ReservedSong";
import ReservedSongRecord from "../domain/entities/ReservedSongRecord";
import SongRecord from "../domain/entities/SongRecord";
import { ChildProcess, exec } from "child_process";

export default interface KaraokeManager {
  delegate: KaraokeDelegate | undefined;
  playNext(): Promise<void>;
  stop(): Promise<void>;
}

export interface KaraokeDelegate {
  getReservedSongRecords(): Promise<ReservedSongRecord[]>;
  markedAsPlaying(reserved: ReservedSongRecord): Promise<void>;
  shiftReservedSongs(): Promise<void>;
}


export class DefaultKaraokeManager implements KaraokeManager {
  delegate: KaraokeDelegate | undefined;
  
  private directoryPath: string;
  private vlcCli: string;

  private currentProcess: ChildProcess | undefined;
  private shiftPromise: Promise<void> | undefined;
  private shiftCompletion: (() => void) | undefined;

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
    const file = songRecord.source;
    const vlcCommand = `${this.vlcCli} "${this.directoryPath}/${file}" --fullscreen vlc://quit`;
    
    await this.delegate?.markedAsPlaying(reservedSongs[0]);
    await this.executeCommand(vlcCommand)
    await this.delegate?.shiftReservedSongs();
    this.shiftCompletion?.();
    await this.playNext();
  }

  async stop(): Promise<void> {
    this.shiftPromise = new Promise<void>((resolve, reject) => {
      this.shiftCompletion = resolve;
    });
    this.currentProcess?.kill();
    // wait for the reserver to shift the songs
    // just delay for 1 second; I think it's enough
    await this.shiftPromise;
  }
  
  private async executeCommand(command: string) {
    var promise = new Promise<void>((resolve, reject) => {
      this.currentProcess = exec(command, (error) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log(`Command executed successfully: ${command}`);
          resolve();
        }
      });
      this.currentProcess.on('exit', (code, signal) => {
        console.log(`Command exited with code: ${code} and signal: ${signal}`);
        resolve();
      });
    });
    await promise;
  }
}
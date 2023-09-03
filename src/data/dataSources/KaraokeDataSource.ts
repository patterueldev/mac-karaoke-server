import mongoose from "mongoose";
import Song from "../../domain/entities/Song";
import SongRecord from "../../domain/entities/SongRecord";
import KaraokeRepository from "../repositories/KaraokeRepository";
import fs from 'fs';
import { MongooseSongRecord } from "../../domain/entities/mongodb/MongooseSongRecord";
import KaraokeManager from "../../common/KaraokeManager";

export default class KaraokeDataSource implements KaraokeRepository {
  private uri: string;
  private client: typeof mongoose | undefined;
  private manager: KaraokeManager;
  
  directoryPath: string;
  constructor(uri: string, directoryPath: string, manager: KaraokeManager) {
    this.uri = uri;
    this.directoryPath = directoryPath;
    this.manager = manager;
  }

  private async initializeClient(): Promise<typeof mongoose> {
    if (!this.client) {
      this.client = await mongoose.connect(this.uri);
    }
    return this.client;
  }

  async getSongRecords(): Promise<SongRecord[]> {
    await this.initializeClient();
    const songs = await MongooseSongRecord.find();
    return songs;
  }
  
  getSongFiles(): Promise<string[]> {
    const files = fs.readdirSync(this.directoryPath);
    // filter only video files
    // file types: mp4, mkv, avi, webm, mov
    const videoFiles = files.filter((file) => {
      const fileExtension = file.split('.').pop();
      if (!fileExtension) return false;
      return ['mp4', 'mkv', 'avi', 'webm', 'mov'].includes(fileExtension);
    });
    return Promise.resolve(videoFiles);
  }
  
  async createSongsFromFiles(files: string[]): Promise<Song[]> {
    await this.initializeClient();
    const songs = files.map((file) => {
      return new MongooseSongRecord({
        title: file,
        artist: undefined,
        image: undefined,
        file: file,
      });
    });
    const result = await MongooseSongRecord.insertMany(songs);
    return result;
  }

  async getSongRecord(identifier: string): Promise<SongRecord> {
    await this.initializeClient();
    const record = await MongooseSongRecord.findOne({ _id: identifier });
    if (!record) return Promise.reject(`Song with id: ${identifier} not found!`);
    return record;
  }

  addToQueue(record: SongRecord): void {
    this.manager.addToQueue(record);
  }

  getQueue(): SongRecord[] {
    return this.manager.getQueue();
  }
}
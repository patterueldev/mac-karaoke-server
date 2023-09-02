import mongoose from "mongoose";
import Song from "../../domain/entities/Song";
import SongRecord from "../../domain/entities/SongRecord";
import KaraokeRepository from "../repositories/KaraokeRepository";
import fs from 'fs';
import { MongooseSongRecord } from "../../domain/entities/mongodb/MongooseSongRecord";

export default class KaraokeDataSource implements KaraokeRepository {
  private uri: string;
  private client: typeof mongoose | undefined;
  
  directoryPath: string;
  constructor(uri: string, directoryPath: string) {
    this.uri = uri;
    this.directoryPath = directoryPath;
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
  
  /*

const mongooseSongRecordSchema = new Schema<MongooseSongRecordModel>({
  title: { type: String, required: true },
  artist: { type: String, required: false },
  image: { type: String, required: false },
  file: { type: String, required: true },
}, {
  */
  async createSongsFromFiles(files: string[]): Promise<SongRecord[]> {
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
}
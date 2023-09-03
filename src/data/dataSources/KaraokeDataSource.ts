import mongoose from "mongoose";
import Song from "../../domain/entities/Song";
import SongRecord from "../../domain/entities/SongRecord";
import KaraokeRepository from "../repositories/KaraokeRepository";
import fs from 'fs';
import { MongooseSongRecord } from "../../domain/entities/mongodb/MongooseSongRecord";
import KaraokeManager, { KaraokeDelegate } from "../../common/KaraokeManager";
import { MongooseReservedSongRecord } from "../../domain/entities/mongodb/MongooseReservedSongRecord";
import ReservedSong from "../../domain/entities/ReservedSong";
import ReservedSongRecord from "../../domain/entities/ReservedSongRecord";

export default class KaraokeDataSource implements KaraokeRepository {
  private uri: string;
  private client: typeof mongoose | undefined;
  private manager: KaraokeManager;
  
  directoryPath: string;
  constructor(uri: string, directoryPath: string, manager: KaraokeManager) {
    this.uri = uri;
    this.directoryPath = directoryPath;
    manager.delegate = this;
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

  async reserveSong(record: SongRecord): Promise<void> {
    await this.initializeClient();
    const songRecord = await MongooseSongRecord.findOne({ _id: record.identifier });
    const reserved = new MongooseReservedSongRecord({
      songRecord: songRecord,
    });
    await reserved.save();
    var reservedSongs = await this.getReservedSongRecords();
    if(reservedSongs.length == 1) {
      await this.manager.playNext();
    }
  }

  async getQueue(): Promise<ReservedSong[]> {
    var records = await this.getReservedSongRecords();
    return records.map((record) => {
      return record.justReservedSong();
    });
  }

  async getReservedSongRecords(): Promise<ReservedSongRecord[]> {
    await this.initializeClient();
    const reserved = await MongooseReservedSongRecord.find().populate('songRecord');
    return reserved;
  }
  
  async resumeQueue(): Promise<void> {
    this.manager.playNext();
  }

  // KaraokeDelegate methods
  async shiftReservedSongs(): Promise<void> {
    await this.initializeClient();
    const reserved = await MongooseReservedSongRecord.findOne();
    if (!reserved) return;
    await reserved.deleteOne();
  } 
}
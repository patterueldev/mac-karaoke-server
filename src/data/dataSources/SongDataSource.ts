import mongoose from "mongoose";
import SongRepository from "../repositories/SongRepository";
import Song from "../../domain/entities/Song";
import { MongooseSongRecord } from "../../domain/entities/mongodb/MongooseSongRecord";

export default class SongDataSource implements SongRepository {
  private clientBuilder: () => Promise<typeof mongoose>;
  constructor(clientBuilder: () => Promise<typeof mongoose>) {
    this.clientBuilder = clientBuilder;
  }
  
  private client: typeof mongoose | undefined;
  private async initializeClient(): Promise<typeof mongoose> {
    if (!this.client) {
      this.client = await this.clientBuilder();
    }
    return this.client;
  }

  async createSongsFromFiles(files: string[]): Promise<Song[]> {
    await this.initializeClient();
    const songRecords = files.map((file) => {
      return new MongooseSongRecord({
        title: file,
        artist: undefined,
        image: undefined,
        source: file,
      });
    });
    const result = await MongooseSongRecord.insertMany(songRecords);
    return result;
  }

  async getSongs(filter?: string, offset?: number, limit?: number): Promise<Song[]> {
    await this.initializeClient();
    // const songs = await MongooseSongRecord.find();
    if (!limit) limit = 0;
    var filterQuery: mongoose.FilterQuery<any> = {};
    if (filter) {
      filterQuery.$or = [
        { title: { $regex: filter, $options: 'i' } },
        { artist: { $regex: filter, $options: 'i' } },
        { file: { $regex: filter, $options: 'i' } },
        { 'localizations.text': { $regex: filter, $options: 'i' } },
      ];
    }
    return await MongooseSongRecord.find(filterQuery)
      .sort({ title: 1 })
      .skip(offset || 0)
      .limit(limit);
  }

  async getSong(identifier: string): Promise<Song> {
    await this.initializeClient();
    const record = await MongooseSongRecord.findById(identifier);
    if (!record) return Promise.reject(`Song with id: ${identifier} not found!`);
    return record;
  }

  async getUnupdatedSongs(limit?: number): Promise<Song[]> {
    await this.initializeClient();
    // fetch first 10 songs that are not updated
    return await MongooseSongRecord.find({ openAIUpdated: false }).limit(limit || 5);
  }

  async updateMetadataForSongs(songs: Song[]): Promise<Song[]> {
    var updatedRecords: Song[] = [];
    for (var i = 0; i < songs.length; i++) {
      let raw = songs[i];
      let record = await MongooseSongRecord.findOne({ source: raw.source });
      if (!record) throw new Error(`Song with source: ${raw.source} not found!`);
      record.title = raw.title;
      record.artist = raw.artist;
      record.openAIUpdated = true;
      record.language = raw.language;
      record.localizations = raw.localizations;
      await record.save();
      updatedRecords.push(record);
    }
    return updatedRecords;
  }
}
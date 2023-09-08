import mongoose from "mongoose";
import SongRepository from "../repositories/SongRepository";
import Song from "../../domain/entities/Song";
import { MongooseSongRecord } from "../../domain/entities/mongodb/MongooseSongRecord";

export default class SongDataSource implements SongRepository {
  private uri: string;
  private clientBuilder: () => Promise<typeof mongoose>;
  constructor(uri: string, clientBuilder: () => Promise<typeof mongoose>) {
    this.uri = uri;
    this.clientBuilder = clientBuilder;
  }
  
  private client: typeof mongoose | undefined;
  private async initializeClient(): Promise<typeof mongoose> {
    if (!this.client) {
      this.client = await this.clientBuilder();
    }
    return this.client;
  }

  async createSongs(songs: Song[]): Promise<Song[]> {
    return [];
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
}
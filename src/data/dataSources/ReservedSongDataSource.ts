import mongoose from "mongoose";
import Song from "../../domain/entities/Song";
import ReservedSongRepository from "../repositories/ReservedSongRepository";
import { MongooseSongRecord } from "../../domain/entities/mongodb/MongooseSongRecord";
import ReservedSong from "../../domain/entities/ReservedSong";
import { MongooseReservedSongRecord } from "../../domain/entities/mongodb/MongooseReservedSongRecord";

export default class ReservedSongDataSource implements ReservedSongRepository{
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

  // create
  async createReservedSong(song: Song): Promise<ReservedSong> {
    await this.initializeClient();
    const songRecord = await MongooseSongRecord.findOne({ _id: song.identifier });

    const latest = await MongooseReservedSongRecord.findOne({ after: null });
    const reserved = new MongooseReservedSongRecord({
      songRecord: songRecord,
      before: latest,
    });
    await reserved.save(); 

    latest?.set({ after: reserved });
    await latest?.save();
    
    return reserved;
  }

  // read
  async getReservedSongs(): Promise<ReservedSong[]> {
    await this.initializeClient();
    const reserved = await MongooseReservedSongRecord.find().populate('songRecord');
    // sort by considering before and after
    const sorted = reserved.sort((a, b) => {
      if (a.before && a.before.identifier === b.identifier) return -1;
      if (a.after && a.after.identifier === b.identifier) return 1;
      return 0;
    });
    return sorted;
  }

  // update
  async moveReservedSongInBetween(reservationId: string, beforeId?: string, afterId?: string): Promise<void> {
    await this.initializeClient();
    const reservation = await MongooseReservedSongRecord.findById(reservationId);
    if (!reservation) return Promise.reject(`Reserved song with id: ${reservationId} not found!`);
    if (beforeId) {
      const before = await MongooseReservedSongRecord.findById(beforeId);
      if (!before) return Promise.reject(`Reserved song with id: ${beforeId} not found!`);
      reservation.before = before;
    }
    if (afterId) {
      const after = await MongooseReservedSongRecord.findById(afterId);
      if (!after) return Promise.reject(`Reserved song with id: ${afterId} not found!`);
      reservation.after = after;
    }
    await reservation.save();
  }
  // delete
  async deleteReservedSong(reservationId: string): Promise<void> {
    await this.initializeClient();
    const reservation = await MongooseReservedSongRecord.findById(reservationId);
    if (!reservation) return Promise.reject(`Reserved song with id: ${reservationId} not found!`);
    await reservation.deleteOne();
  }

  async shiftReservedSongList(): Promise<void> {
    await this.initializeClient();
    const reserved = await MongooseReservedSongRecord.findOne();
    if (!reserved) return;
    await reserved.deleteOne();
  }
}
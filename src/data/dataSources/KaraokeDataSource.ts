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
import OpenAI from "openai";

export default class KaraokeDataSource implements KaraokeRepository {
  private uri: string;
  private client: typeof mongoose | undefined;
  private manager: KaraokeManager;
  private openai: OpenAI;
  
  directoryPath: string;
  constructor(uri: string, directoryPath: string, manager: KaraokeManager, openai: OpenAI) {
    this.uri = uri;
    this.directoryPath = directoryPath;
    manager.delegate = this;
    this.manager = manager;
    this.openai = openai;
  }

  private async initializeClient(): Promise<typeof mongoose> {
    if (!this.client) {
      this.client = await mongoose.connect(this.uri);
    }
    return this.client;
  }

  async getSongRecords(limit?: number, filter?: string): Promise<SongRecord[]> {
    await this.initializeClient();
    // const songs = await MongooseSongRecord.find();
    if (!limit) limit = 0;
    var songs = await MongooseSongRecord.find().limit(limit);
    if (filter) {
      songs = songs.filter((song) => {
        return song.title.toLowerCase().includes(filter.toLowerCase()) || 
          song.artist?.toLowerCase().includes(filter.toLowerCase()) ||
          song.localizations?.some((localization) => {
              return localization.text.toLowerCase().includes(filter.toLowerCase())
          }) ||
          song.file.toLowerCase().includes(filter.toLowerCase());
      });
    }
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

  async getUnupdatedSongRecords(limit: number): Promise<SongRecord[]> {
    await this.initializeClient();
    // fetch first 10 songs that are not updated
    return await MongooseSongRecord.find({ openAIUpdated: false }).limit(limit);
  }

  async autoUpdateMetadataForSongs(filenames: string[], systemPrompt: string): Promise<Song[]> {
    await this.initializeClient();
    // const filenames = records.map((record) => { return record.file; });
    const body: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: JSON.stringify(filenames),
        }
      ],
      max_tokens: 3000,
      temperature: 0.2,
    };
    console.log("openai request: ", JSON.stringify(body, null, 2));
    const completion = await this.openai.chat.completions.create(body);
    var choices = completion.choices;
    var output = JSON.stringify(choices, null, 2);
    console.log("openai output: ", output);
    if (!choices || choices.length == 0) throw new Error('No choices found!');
    var content = choices[0].message.content;
    if (!content) throw new Error('No content found!');

    const result = JSON.parse(content);
    if (!result || !Array.isArray(result)) throw new Error('Invalid result!');

    // update the records
    var updatedRecords: SongRecord[] = [];
    for (var i = 0; i < result.length; i++) {
      var record = result[i];
      var songRecord = await MongooseSongRecord.findOne({ file: record.file });
      if (!songRecord) continue;
      songRecord.title = record.title;
      songRecord.artist = record.artist;
      songRecord.openAIUpdated = true;
      songRecord.language = record.language;
      songRecord.localizations = record.localizations;
      await songRecord.save();
      updatedRecords.push(songRecord);
    }
    return updatedRecords.map((record) => { return record.justSong(); });
  }
}
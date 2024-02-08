import OpenAI from "openai";
import http from 'http';
import express, {Express} from 'express';
import fs from 'fs';
import { Server } from "socket.io";
import GenerateServerQRUseCase, { DefaultGenerateServerQRUseCase } from "../domain/useCases/GenerateServerQRUseCase";
import GetReservedSongListUseCase, { DefaultGetReservedSongListUseCase } from "../domain/useCases/GetReservedSongListUseCase";
import GetSongListUseCase, { DefaultGetSongListUseCase } from "../domain/useCases/GetSongListUseCase";
import ReserveSongUseCase, { DefaultReserveSongUseCase } from "../domain/useCases/ReserveSongUseCase";
import SynchronizeRecordsUseCase, { DefaultSynchronizeRecordsUseCase } from "../domain/useCases/SynchronizeRecordsUseCase";
import AutoUpdateSongsUseCase, { DefaultAutoUpdateSongsUseCase } from "../domain/useCases/AutoUpdateSongsUseCase";
import RemoveReservedSongUseCase, { DefaultRemoveReservedSongUseCase } from "../domain/useCases/RemoveReservedSongUseCase";
import StopCurrentSongUseCase, { DefaultStopCurrentSongUseCase } from "../domain/useCases/StopCurrentSongUseCase";
import GetSongUseCase, { DefaultGetSongUseCase } from "../domain/useCases/GetSongUseCase";
import OnPlayerClientConnectedUseCase, { DefaultOnPlayerClientConnectedUseCase } from "../domain/useCases/OnPlayerClientConnectedUseCase";
import ReservedSongRepository from "../data/repositories/ReservedSongRepository";
import SongRepository from "../data/repositories/SongRepository";
import SongDataSource from "../data/dataSources/SongDataSource";
import mongoose from "mongoose";
import ReservedSongDataSource from "../data/dataSources/ReservedSongDataSource";
import OnControllerClientConnectedUseCase, { DefaultOnControllerClientConnectedUseCase } from "../domain/useCases/OnControllerClientConnectedUseCase";
import OnPlayerClientFinishedPlayingUseCase, { DefaultOnPlayerClientFinishedPlayingUseCase } from "../domain/useCases/OnPlayerClientFinishedPlayingUseCase";
import OnControllerSongStopUseCase, { DefaultOnControllerSongStopUseCase } from "../domain/useCases/OnControllerSongStopUseCase";
import EmitterManager, { SocketIOManager } from "./EmitterManager";
import { Lazy, lazyValue, lazyValueAsync } from "./Lazy";
import FileRepository from "../data/repositories/FileRepository";
import FileDataSource from "../data/dataSources/FileDataSource";
import GenerativeAIRepository from "../data/repositories/GenerativeAIRepository";
import GenerativeAIDataSource from "../data/dataSources/GenerativeAIDataSource";
import Constants from "./Constants";
import GetSongMediaPathUseCase, { DefaultGetSongMediaPathUseCase } from "../domain/useCases/GetSongMediaPathUseCase";
import StreamingSiteRepository from "../data/repositories/StreamingSiteRepository";
import GetSongMetadataForUrlUseCase, { DefaultGetSongMetadataForUrlUseCase } from "../domain/useCases/GetSongMetadataForUrlUseCase";
import { youtube_v3 } from "@googleapis/youtube";
import ytdl from "ytdl-core";
import StreamingSiteDataSource from "../data/dataSources/StreamingSiteDataSource";
import OptimizedSongDataUseCase, { DefaultOptimizedSongDataUseCase } from "../domain/useCases/OptimizedSongDataUseCase";
import DownloadManager, { DefaultDownloadManager } from "./DownloadManager";
import DownloadDataFromUrlUseCase, { DefaultDownloadDataFromUrlUseCase } from "../domain/useCases/DownloadDataFromUrlUseCase";
import DownloadSongUseCase, { DefaultDownloadSongUseCase } from "../domain/useCases/DownloadSongUseCase";
import RemoveSongUseCase, { DefaultRemoveSongUseCase } from "../domain/useCases/RemoveSongUseCase";

export default class Dependencies {
  // Private & internal dependencies
  private static clientBuilder: Lazy<() => Promise<typeof mongoose>> = lazyValue(() => lazyValueAsync(async () => {
    try {
      return await mongoose.connect(Constants.uri())
    } catch (error) {
      console.error('Error connecting to MongoDB: ');
      console.error(error);
      throw error;
    }
  }));
  private static emitterManager: Lazy<EmitterManager> = lazyValue(() => new SocketIOManager());
  private static downloadManager: Lazy<DownloadManager> = lazyValue(() => new DefaultDownloadManager(this.ytdl(), this.fs(), Constants.directoryPath()));
  private static fs: Lazy<typeof fs> = lazyValue(() => fs);
  private static openAI: Lazy<OpenAI> = lazyValue(() => new OpenAI({ apiKey: Constants.openAIKey() }));
  private static ytdl: Lazy<typeof ytdl> = lazyValue(() => ytdl);

  private static songRepository: Lazy<SongRepository> = lazyValue(() => new SongDataSource(this.clientBuilder()));
  private static reservedSongRepository: Lazy<ReservedSongRepository> = lazyValue(() => new ReservedSongDataSource(this.clientBuilder()));
  private static fileRepository: Lazy<FileRepository> = lazyValue(() => new FileDataSource(Constants.directoryPath()));
  private static generativeAIRepository: Lazy<GenerativeAIRepository> = lazyValue(() => new GenerativeAIDataSource(this.openAI(), Constants.songFilePrompt(), Constants.videoMetadataPrompt()));
  private static streamingSiteRepository: Lazy<StreamingSiteRepository> = lazyValue(() => new StreamingSiteDataSource(this.ytdl()));

  // Public dependencies
  static expressApp: Lazy<Express> = lazyValue(() => express());
  static httpServer: Lazy<http.Server> = lazyValue(() => http.createServer(this.expressApp()));
  static socketServer: Lazy<Server> = lazyValue(() => new Server(this.httpServer()));

  // API Use Cases
  static getSongListUseCase: Lazy<GetSongListUseCase> = lazyValue(() => new DefaultGetSongListUseCase(this.songRepository()));
  static getSongWithIDUseCase: Lazy<GetSongUseCase> = lazyValue(() => new DefaultGetSongUseCase(this.songRepository()));
  static reserveSongUseCase: Lazy<ReserveSongUseCase> = lazyValue(() => new DefaultReserveSongUseCase(this.songRepository(), this.reservedSongRepository(), this.emitterManager()));

  static getReservedSongListUseCase: Lazy<GetReservedSongListUseCase> = lazyValue(() => new DefaultGetReservedSongListUseCase(this.reservedSongRepository()));
  static removeReservedSongUseCase: Lazy<RemoveReservedSongUseCase> = lazyValue(() => new DefaultRemoveReservedSongUseCase(this.reservedSongRepository(), this.emitterManager()));
  static stopCurrentSongUseCase: Lazy<StopCurrentSongUseCase> = lazyValue(() => new DefaultStopCurrentSongUseCase(this.reservedSongRepository(), this.emitterManager()));

  static synchronizeRecordsUseCase: Lazy<SynchronizeRecordsUseCase> = lazyValue(() => new DefaultSynchronizeRecordsUseCase(this.fileRepository(), this.songRepository(), this.downloadManager()));
  static autoUpdateSongsUseCase: Lazy<AutoUpdateSongsUseCase> = lazyValue(() => new DefaultAutoUpdateSongsUseCase(this.songRepository(), this.generativeAIRepository()));
  
  static getSongMetadataForUrlUseCase: Lazy<GetSongMetadataForUrlUseCase> = lazyValue(() => new DefaultGetSongMetadataForUrlUseCase(this.streamingSiteRepository(), this.generativeAIRepository(), this.downloadManager()));
  static optimizedSongDataUseCase: Lazy<OptimizedSongDataUseCase> = lazyValue(() => new DefaultOptimizedSongDataUseCase(this.songRepository(), this.streamingSiteRepository(), this.generativeAIRepository()));
  static removeSongUseCase: Lazy<RemoveSongUseCase> = lazyValue(() => new DefaultRemoveSongUseCase(this.songRepository()));
  static downloadDataFromUrlUseCase: Lazy<DownloadDataFromUrlUseCase> = lazyValue(() => new DefaultDownloadDataFromUrlUseCase(this.downloadManager()));
  static downloadSongUseCase: Lazy<DownloadSongUseCase> = lazyValue(() => new DefaultDownloadSongUseCase(this.downloadManager(), this.songRepository()));
  
  // Web Frontend Use Cases
  static generateServerQRUseCase: Lazy<GenerateServerQRUseCase> = lazyValue(() => new DefaultGenerateServerQRUseCase(Constants.serverPort()));
  static getSongMediaPathUseCase: Lazy<GetSongMediaPathUseCase> = lazyValue(() => new DefaultGetSongMediaPathUseCase(this.songRepository(), Constants.directoryPath()));

  // Socket IO Use Cases
  static onPlayerClientConnectedUseCase: Lazy<OnPlayerClientConnectedUseCase> = lazyValue(() => new DefaultOnPlayerClientConnectedUseCase(this.reservedSongRepository(), this.emitterManager()));
  static onPlayerClientFinishedPlayingUseCase: Lazy<OnPlayerClientFinishedPlayingUseCase> = lazyValue(() => new DefaultOnPlayerClientFinishedPlayingUseCase(this.reservedSongRepository(), this.emitterManager()));
  static onControllerClientConnectedUseCase: Lazy<OnControllerClientConnectedUseCase> = lazyValue(() => new DefaultOnControllerClientConnectedUseCase(this.reservedSongRepository(), this.emitterManager()));
  static onControllerSongStopUseCase: Lazy<OnControllerSongStopUseCase> = lazyValue(() => new DefaultOnControllerSongStopUseCase(this.reservedSongRepository(), this.emitterManager()));
}
import OpenAI from "openai";
import http from 'http';
import express, {Express} from 'express';
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

export default class Dependencies {
  // Private & internal dependencies
  private static clientBuilder: Lazy<() => Promise<typeof mongoose>> = lazyValue(() => lazyValueAsync(async () => await mongoose.connect(Constants.uri())));
  private static emitterManager: Lazy<EmitterManager> = lazyValue(() => new SocketIOManager());
  private static openAI: Lazy<OpenAI> = lazyValue(() => new OpenAI({ apiKey: Constants.openAIKey() }));

  private static songRepository: Lazy<SongRepository> = lazyValue(() => new SongDataSource(this.clientBuilder()));
  private static reservedSongRepository: Lazy<ReservedSongRepository> = lazyValue(() => new ReservedSongDataSource(this.clientBuilder()));
  private static fileRepository: Lazy<FileRepository> = lazyValue(() => new FileDataSource(Constants.directoryPath()));
  private static generativeAIRepository: Lazy<GenerativeAIRepository> = lazyValue(() => new GenerativeAIDataSource(this.openAI(), Constants.systemPrompt()));

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

  static synchronizeRecordsUseCase: Lazy<SynchronizeRecordsUseCase> = lazyValue(() => new DefaultSynchronizeRecordsUseCase(this.fileRepository(), this.songRepository()));
  static autoUpdateSongsUseCase: Lazy<AutoUpdateSongsUseCase> = lazyValue(() => new DefaultAutoUpdateSongsUseCase(this.songRepository(), this.generativeAIRepository()));

  // Web Frontend Use Cases
  static generateServerQRUseCase: Lazy<GenerateServerQRUseCase> = lazyValue(() => new DefaultGenerateServerQRUseCase(Constants.serverPort()));
  static getSongMediaPathUseCase: Lazy<GetSongMediaPathUseCase> = lazyValue(() => new DefaultGetSongMediaPathUseCase(this.songRepository(), Constants.directoryPath()));

  // Socket IO Use Cases
  static onPlayerClientConnectedUseCase: Lazy<OnPlayerClientConnectedUseCase> = lazyValue(() => new DefaultOnPlayerClientConnectedUseCase(this.reservedSongRepository(), this.emitterManager()));
  static onPlayerClientFinishedPlayingUseCase: Lazy<OnPlayerClientFinishedPlayingUseCase> = lazyValue(() => new DefaultOnPlayerClientFinishedPlayingUseCase(this.reservedSongRepository(), this.emitterManager()));
  static onControllerClientConnectedUseCase: Lazy<OnControllerClientConnectedUseCase> = lazyValue(() => new DefaultOnControllerClientConnectedUseCase(this.reservedSongRepository(), this.emitterManager()));
  static onControllerSongStopUseCase: Lazy<OnControllerSongStopUseCase> = lazyValue(() => new DefaultOnControllerSongStopUseCase(this.reservedSongRepository(), this.emitterManager()));
}
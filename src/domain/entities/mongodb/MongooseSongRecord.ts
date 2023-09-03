import { MongooseLocalization } from './MongooseLocalization';
import SongRecord, { justSong } from "../SongRecord";
import mongoose, { Document, Schema } from "mongoose";
import Localization from '../Localization';

interface MongooseSongRecordModel extends SongRecord, Document {
  openAIUpdated: boolean;
  language: string | undefined;
  localizations: Localization[];
}


const mongooseSongRecordSchema = new Schema<MongooseSongRecordModel>({
  title: { type: String, required: true },
  artist: { type: String, required: false },
  image: { type: String, required: false },
  file: { type: String, required: true },
  containsLyrics: { type: Boolean, required: true, default: true },
  containsVoice: { type: Boolean, required: true, default: false },
  openAIUpdated: { type: Boolean, required: true, default: false },
  language: { type: String, required: false },
  localizations: { type: [MongooseLocalization.schema], required: true, default: [] },
}, {
  toJSON: { getters: true },
  id: false,
});

mongooseSongRecordSchema.virtual("identifier").get(function(this: MongooseSongRecordModel) {
  return this._id.toString();
});
mongooseSongRecordSchema.methods.justSong = function(this: MongooseSongRecordModel) {
  return justSong(this);
}

export const MongooseSongRecord = mongoose.model<MongooseSongRecordModel>("song", mongooseSongRecordSchema);
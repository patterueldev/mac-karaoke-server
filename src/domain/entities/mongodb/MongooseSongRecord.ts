import SongRecord from "../SongRecord";
import mongoose, { Document, Schema } from "mongoose";

interface MongooseSongRecordModel extends SongRecord, Document {
  
}

/*
  identifier: string;
  title: string;
  artist: string | undefined;
  image: string | undefined;
  file: string;
*/
const mongooseSongRecordSchema = new Schema<MongooseSongRecordModel>({
  title: { type: String, required: true },
  artist: { type: String, required: false },
  image: { type: String, required: false },
  file: { type: String, required: true },
}, {
  toJSON: { getters: true },
  id: false,
});

mongooseSongRecordSchema.virtual("identifier").get(function(this: MongooseSongRecordModel) {
  return this._id.toString();
});

export const MongooseSongRecord = mongoose.model<MongooseSongRecordModel>("song", mongooseSongRecordSchema);
import mongoose, { Document, Schema } from "mongoose";
import ReservedSongRecord, { justReservedSong } from "../ReservedSongRecord";

interface MongooseReservedSongRecordModel extends ReservedSongRecord, Document {
}

const mongooseReservedSongSchema = new Schema<MongooseReservedSongRecordModel>({
  songRecord: { type: Schema.Types.ObjectId, ref: "song", required: true },
}, {
  toJSON: { getters: true },
  id: false,
});

mongooseReservedSongSchema.virtual("identifier").get(function(this: MongooseReservedSongRecordModel) {
  return this._id.toString();
});
mongooseReservedSongSchema.virtual("song").get(function(this: MongooseReservedSongRecordModel) {
  return this.songRecord.justSong();
});
mongooseReservedSongSchema.methods.justReservedSong = function(this: MongooseReservedSongRecordModel) {
  return justReservedSong(this);
}

export const MongooseReservedSongRecord = mongoose.model<MongooseReservedSongRecordModel>("reservedSong", mongooseReservedSongSchema);

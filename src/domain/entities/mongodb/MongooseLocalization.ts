import mongoose from "mongoose";
import Localization from "../Localization";

export interface MongooseLocalizationModel extends Localization, mongoose.Document {}

const localizationSchema = new mongoose.Schema({
  locale: { type: String, required: true },
  text: { type: String, required: true },
});

export const MongooseLocalization = mongoose.model<MongooseLocalizationModel>('MongooseLocalization', localizationSchema)
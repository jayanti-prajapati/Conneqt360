import mongoose, { Schema, Model } from "mongoose";
import { ICustomFileDocument } from "../../types";

const customSchema = new Schema<ICustomFileDocument>({
  fileName: { type: String, required: false },
  type: { type: String, required: false },
  uploadedBy: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

export const CustomFile: Model<ICustomFileDocument> = mongoose.model<ICustomFileDocument>(
  "custom_files",
  customSchema
);

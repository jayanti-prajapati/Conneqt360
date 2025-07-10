import mongoose, { Schema } from "mongoose";
import { ICatalog } from "../../types";

const catalogSchema = new Schema<ICatalog>({
    title: {
    type: String,
    required: true,
    default: null,
  },
  description: {
    type: String,
    required: false,
    default: null,
  },
  images: {
    type: [String],
    required: true,
    default: null,
  },
   price: {
    type: String,
    required: true,
    default: null,
  },
  category: {
    type: String,
    required: true,
    default: null,
  },
  tags: {
    type: [String],
    required: true,
    default: null,
  },
    createdAt: {
    type: Date,
    default: Date.now,
  }
});

export const Catalog = mongoose.model<ICatalog>(
    "Catalog",
    catalogSchema
)
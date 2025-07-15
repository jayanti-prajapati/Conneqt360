import mongoose, { Schema } from "mongoose";
import { IUserServices } from "../../types";

const serviceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false,
    default: null,
  },
  features: {
    type: [String],
    required: true,
    default: null,
  },
});


const catalogSchema = new Schema({
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
  },
});

const clientSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: null,
  },
  logo: {
    type: String,
    required: true,
    default: null,
  },
  testimonial: {
    type: String,
    required: true,
    default: null,
  },
  rating: {
    type: String,
    required: true,
    default: null,
  },
  projectType: {
    type: String,
    required: true,
    default: null,
  },
  completedDate: {
    type: Date,
    default: Date.now,
  },
});

const userServicesSchema = new Schema<IUserServices>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    services: { type: [serviceSchema], default: [] },
    catalog: { type: [catalogSchema], default: [] },
    client: { type: [clientSchema], default: [] },
  },
  { timestamps: true }
);

export const UserServices = mongoose.model<IUserServices>(
  "UserServices",
  userServicesSchema
);

import mongoose, { Schema, Model, Types } from "mongoose";
import { IPost } from "../../types";

const feedSchema = new Schema<IPost>({
  content: {
    type: String,
    required: false,
    default: null,
  },
  imageUrl: {
    type: String,
    required: false,
    default: null,
  },
  videoUrl: {
    type: String,
    required: false,
    default: null,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    default: null,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        default: null,
      },
      content: {
        type: String,
        required: true,
        default: null,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  description: {
    type: String,
    required: false,
    default: null,
  },
  share: {
    type: String,
    required: false,
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface IPostModel extends Model<IPost> {
  getFeedByUserId(filter: any): Promise<IPost[]>;
}

feedSchema.statics.getFeedByUserId = function (filter) {
  return this.find(filter)
    .populate("user", "name username email phone businessName businessType")
    .populate("comments.user", "name username email phone businessName businessType")
    .sort({ createdAt: -1 });
};

export const Community_Feeds = mongoose.model<IPost, IPostModel>(
  "community_feeds",
  feedSchema
);

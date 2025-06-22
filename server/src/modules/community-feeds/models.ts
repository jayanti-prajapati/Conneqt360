import mongoose, { Schema, Model, Types } from "mongoose";
import { IPost } from "../../types";

const feedSchema = new Schema<IPost>({
  content: {
    type: String,
    required: false,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  videoUrl: {
    type: String,
    required: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: {
        type: String,
        required: true,
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
  },
  share: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



export interface IPostModel extends Model<IPost> {
  getFeedByUserId(userId: string | Types.ObjectId): Promise<IPost | null>;
}

feedSchema.statics.getFeedByUserId = function (userId: string | Types.ObjectId) {
  return this.find({ user: new mongoose.Types.ObjectId(userId) })
    .populate("user", "username email phone businessName businessType")
    .populate("comments.user", "username phone")
    .sort({ createdAt: -1 });
};



export const Community_Feeds = mongoose.model<IPost, IPostModel>(
  "community_feeds",
  feedSchema
);

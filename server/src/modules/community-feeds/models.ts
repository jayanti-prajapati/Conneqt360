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
    required: false,
    default: null,
  },
   location: {
    type: String,
    required: false,
    default: null,
  },
   tags: {
    type: [String],
    required: false,
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
        required: false,
      },
      content: {
        type: String,
        required: false,
      },
      replyTo: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: null,
      },
      parentCommentId: {
        type: Schema.Types.ObjectId,
        ref: "Post.comments",
        required: false,
        default: null,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: null,
      },
      edited: {
        type: Boolean,
        default: false,
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
    .populate(
      "comments.user",
      "name username email phone businessName businessType"
    )
    .sort({ createdAt: -1 });
};

export const Community_Feeds = mongoose.model<IPost, IPostModel>(
  "Community_Feeds",
  feedSchema
);

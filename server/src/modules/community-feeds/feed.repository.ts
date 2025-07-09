import { BaseRepository } from "../../shared/base.repository";
import { IPost } from "../../types";
import { Community_Feeds } from "./models";

export class CommunityRepository extends BaseRepository<IPost> {
  constructor() {
    super(Community_Feeds);
  }

  aggregate(pipeline: any[]) {
    return this.model.aggregate(pipeline);
  }

  async getFeedByUserId(userId: string, extraFilter: any = {}) {
    return Community_Feeds.getFeedByUserId({ user: userId, ...extraFilter });
  }

  async update(id: string, data: Partial<IPost>, condition: any) {
  const updateData: any = {};
  const directFields = ["content", "imageUrl", "videoUrl", "description", "share"];

 
  for (const field of directFields) {
    if (data[field as keyof IPost] !== undefined) {
      updateData[field] = data[field as keyof IPost];
    }
  }

 
  if (data.comments && Array.isArray(data.comments)) {
    updateData.$push = {
      comments: {
        $each: data.comments.map((comment) => ({
          user: comment.user,
          content: comment.content,
          createdAt: comment.createdAt || new Date(),
        })),
      },
    };
  }

  return this.model
    .findOneAndUpdate({ _id: id, ...condition }, updateData, { new: true })
    .populate("user", "name username email phone businessName businessType profileUrl")
    .populate("comments.user", "name username email phone businessName businessType profileUrl");
}


  
}

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

  async update(id: string, data: Partial<IPost>, condition: any = {}) {
  const updateData: any = {};
  const setData: any = {};
  const directFields = ["content", "imageUrl", "videoUrl", "description", "share"];

  
  for (const field of directFields) {
    if (data[field as keyof IPost] !== undefined) {
      setData[field] = data[field as keyof IPost];
    }
  }

 
  if (data.likes !== undefined) {
    setData.likes = Array.isArray(data.likes) ? data.likes : [];
  }

 
  if (Object.keys(setData).length > 0) {
    updateData.$set = setData;
  }


  if (data.comments && Array.isArray(data.comments)) {
    updateData.$push = {
      comments: {
        $each: data.comments.map((comment) => ({
          user: comment.user,
          content: comment.content,
          createdAt: comment.createdAt || new Date(),
        })),
        $position: 0
      },
    };
  }


  const updateOp = Object.keys(updateData).length > 0 ? updateData : { likes: [] };

  const updatedPost = await this.model
    .findOneAndUpdate({ _id: id, ...condition }, updateOp, { new: true })
    .populate("user", "name username email phone businessName businessType profileUrl")
    .populate("comments.user", "name username email phone businessName businessType profileUrl");

  
  if (updatedPost && Array.isArray(updatedPost.comments)) {
    updatedPost.comments.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  return updatedPost;
}

}

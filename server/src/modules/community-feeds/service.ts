import { IPost } from "../../types";
import { CommunityRepository } from "./feed.repository";

export class CommunityService {
  private communityRepo = new CommunityRepository();

  async create(feedData: Partial<IPost>) {
    return this.communityRepo.create(feedData);
  }

  async getAll(keyword?: string) {
    const isSearching = Boolean(keyword);

    if (isSearching) {
      const matchStage = {
        $and: [
          { isDeleted: false },
          {
            $or: [
              { "user.username": { $regex: keyword, $options: "i" } },
              { "user.businessName": { $regex: keyword, $options: "i" } },
              { "user.businessType": { $regex: keyword, $options: "i" } },
            ],
          },
        ],
      };

      return this.communityRepo.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        { $match: matchStage },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            content: 1,
            description: 1,
            imageUrl: 1,
            videoUrl: 1,
            share: 1,
            likes: 1,
            comments: {
              user: 1,
              content: 1,
              _id: 1,
              createdAt: 1,
            },
            createdAt: 1,
            user: {
              _id: 1,
              username: 1,
              businessName: 1,
              businessType: 1,
              email: 1,
              phone: 1,
            },
            isDeleted: 1,
          },
        },
      ]);
    }

    // Otherwise return all using populate
    return this.communityRepo
      .findAll({ isDeleted: false })
      .populate("user", "username email phone businessName businessType profileUrl")
      .populate("comments.user", "username phone")
      .sort({ createdAt: -1 });
  }

  async getById(id: string) {
    return this.communityRepo
      .findById(id, { isDeleted: false })
      .populate("user", "username email phone businessName businessType")
      .populate("comments.user", "username phone")
      .sort({ createdAt: -1 });
  }

  async update(id: string, data: Partial<IPost>) {
    return this.communityRepo.update(id, data, { isDeleted: false });
  }

  async delete(id: string) {
    return this.communityRepo.delete(id, { isDeleted: false });
  }

  async getFeedByUserId(userId: string) {
    return this.communityRepo.getFeedByUserId(userId, { isDeleted: false });
  }
}

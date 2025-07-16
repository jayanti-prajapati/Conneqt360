import { IUser } from "../../types";
import { UserRepository } from "./user.repository";

export class UserService {
  private userRepo = new UserRepository();

  async create(userData: Partial<IUser>) {
    return this.userRepo.create(userData);
  }

  async update(id: string, data: Partial<IUser>) {
    return this.userRepo.update(id, data, { status: "active" });
  }


  async getAll(keyword?: string) {
  const isSearching = Boolean(keyword);

  if (isSearching) {
    return this.userRepo.aggregate([
      {
        $match: {
          $and: [
            { status: "active" },
            {
              $or: [
                { name: { $regex: keyword, $options: "i" } },
                { username: { $regex: keyword, $options: "i" } }
              ],
            },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          name: 1,
          username: 1,
          email: 1,
          jobTitle: 1,
          referrels: 1,
          businessName: 1,
          phone: 1,
          businessType: 1,
          businessEmail: 1,
          website: 1,
          address: 1,
          city: 1,
          state: 1,
          postalCode: 1,
          country: 1,
          socialMedia: 1,
          services: 1,
          clients: 1,
          followersCount: 1,
          postsCount: 1,
          isOnline: 1,
          lastSeen: 1,
          profileUrl: 1,
          thumbnail: 1,
          connections: 1,
          products: 1,
          rating: 1,
          gstNumber: 1,
          udyamNumber: 1,
          isSkip: 1,
          aboutUs: 1,
          createdAt: 1,
          status: 1,
        },
      },
    ]);
  }

  // Return all active users when no keyword is provided
  return this.userRepo
    .findAll({ status: "active" })
    .sort({ createdAt: -1 });
}


  async getById(id: string) {
    return this.userRepo.findById(id, { status: "active" });
  }

  async delete(id: string) {
    return this.userRepo.softdelete(id, { status: "active" });
  }

  async getByPhone(phone: string) {
    return this.userRepo.findByPhone(phone, { status: "active" });
  }
}

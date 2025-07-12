import { BaseRepository } from "../../shared/base.repository";
import { IUserServices } from "../../types";
import { UserServices } from "./models";

export class UserServicesRepository extends BaseRepository<IUserServices> {
  constructor() {
    super(UserServices);
  }

  async getByUser(userId: string) {
    return await this.model.findOne({ user: userId }).populate("user", "name username email phone businessName businessType businessEmail profileUrl");
  }

 async updateByUserId(userId: string, data: Partial<IUserServices>) {
  return this.model.findOneAndUpdate(
    { user: userId },
    { $set: data },
    { new: true } 
  );
}


  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}

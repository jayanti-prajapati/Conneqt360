import { BaseRepository } from "../../shared/base.repository";
import { IUser } from "../../types";
import { User } from "../auth/model";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

   aggregate(pipeline: any[]) {
    return this.model.aggregate(pipeline);
  }

  async findByPhone(phone: string, extraFilter: any = {}) {
    return User.findByPhone(phone, extraFilter);
  }
}

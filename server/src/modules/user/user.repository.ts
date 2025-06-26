import { BaseRepository } from "../../shared/base.repository";
import { IUser } from "../../types";
import { User } from "../auth/model";


export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(User);
    }

   async findByPhone(phone: string, extraFilter: any = {}) {
  return User.findByPhone(phone, extraFilter); // ✅ Now works
}


}
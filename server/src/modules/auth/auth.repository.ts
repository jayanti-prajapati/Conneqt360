import { BaseRepository } from "../../shared/base.repository";
import { IUser } from "../../types";
import { User } from "./model";




export class AuthRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

 async findByPhone(phone: string, extraFilter: any = {}) {
    return User.findByPhone({ phone, ...extraFilter});
  }

}

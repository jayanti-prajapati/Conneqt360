import { BaseRepository } from "../../shared/base.repository";
import { IUser } from "../../types";
import { Auth } from "./model";



export class AuthRepository extends BaseRepository<IUser> {
  constructor() {
    super(Auth);
  }

 async findByPhone(phone: string) {
    return Auth.findByPhone(phone);
  }

}

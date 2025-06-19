import { BaseRepository } from "../../shared/base.repository";
import { IUser } from "../../types";
import { User } from "./model";

export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(User);
    }
}
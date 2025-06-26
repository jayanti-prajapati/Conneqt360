import { IUser } from "../../types";
import { UserRepository } from "./user.repository";

export class UserService {
    private userRepo = new UserRepository();

    async create(userData: Partial<IUser>) {
        return this.userRepo.create(userData);
    }

    async update(id: string, data: Partial<IUser>) {
        return this.userRepo.update(id, data, { status: 'active' });
    }

    async getAll() {
        return this.userRepo.findAll({ status: 'active'});
    }

    async getById(id: string) {
        return this.userRepo.findById(id, { status: 'active'});
    }

    async delete(id: string) {
        return this.userRepo.delete(id, { status: 'active'});
    }

   async getByPhone(phone: string) {
  return this.userRepo.findByPhone(phone, { status: 'active'});
}

}
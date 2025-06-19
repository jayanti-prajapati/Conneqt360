import { IUser } from "../../types";
import { UserRepository } from "./user.repository";

export class UserService {
    private userRepo = new UserRepository();

    async create(userData: Partial<IUser>) {
        return this.userRepo.create(userData);
    }

    async update(id: string, data: Partial<IUser>) {
        return this.userRepo.update(id, data);
    }

    async getAll() {
        return this.userRepo.findAll();
    }

    async getById(id: string) {
        return this.userRepo.findById(id);
    }

    async delete(id: string) {
        return this.userRepo.delete(id);
    }
}
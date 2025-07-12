import { IUserServices } from "../../types";
import { UserServicesRepository } from "./userservice.repository";


export class UserServicesService {
  private serviceRepo = new UserServicesRepository();

  async create(serviceData: Partial<IUserServices>) {
    return this.serviceRepo.create(serviceData);
  }

  async update(userId: string, data: Partial<IUserServices>) {
    return this.serviceRepo.updateByUserId(userId, data);
  }

  async getAll() {
    return this.serviceRepo.findAll().populate("user", "name username email phone businessName businessType businessEmail profileUrl");
  }

 async getByUserId(userId: string) {
    return this.serviceRepo.getByUser(userId);
  }

  async getById(id: string) {
    return this.serviceRepo.findById(id).populate("user", "name username email phone businessName businessType businessEmail profileUrl");
  }

  async delete(id: string) {
    return this.serviceRepo.delete(id);
  }


}

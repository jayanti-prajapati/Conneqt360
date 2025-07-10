import { ICatalog } from "../../types";
import { CatalogRepository } from "./catalog.repository";


export class CatalogService {
  private catalogRepo = new CatalogRepository();

  async create(userData: Partial<ICatalog>) {
    return this.catalogRepo.create(userData);
  }

  async update(id: string, data: Partial<ICatalog>) {
    return this.catalogRepo.update(id, data);
  }

  async getAll() {
    return this.catalogRepo.findAll();
  }

  async getById(id: string) {
    return this.catalogRepo.findById(id);
  }

  async delete(id: string) {
    return this.catalogRepo.delete(id);
  }


}

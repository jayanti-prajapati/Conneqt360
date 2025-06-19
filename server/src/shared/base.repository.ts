import { Model, Document } from 'mongoose';

export class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>) {
    return this.model.create(data);
  }

  async findById(id: string) {
    return this.model.findById(id);
  }

  async findAll(filter: Partial<T> = {}) {
    return this.model.find(filter as any);
  }

  async update(id: string, data: Partial<T>) {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}

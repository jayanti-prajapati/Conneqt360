import { Model, Document } from "mongoose";

export class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async create(data: Partial<T>) {
    return this.model.create(data);
  }

  findById(id: string, extraFilter: any = {}) {
    return this.model.findOne({ _id: id, ...extraFilter });
  }

  findAll(filter: Partial<T> = {}) {
    return this.model.find(filter as any);
  }

  async update(
    id: string,
    data: Partial<T>,
    extraFilter: any = {}
  ): Promise<T | null> {
    return this.model.findOneAndUpdate({ _id: id, ...extraFilter }, data, {
      new: true,
    });
  }

  async softdelete(id: string, extraFilter: any = {}): Promise<T | null> {
    return this.model.findOneAndUpdate(
      { _id: id, ...extraFilter },
      { status: "inactive", isDeleted: true },
      { new: true }
    );
  }


}

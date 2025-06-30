import { BaseRepository } from "../../shared/base.repository";
import { ICustomFileDocument } from "../../types";
import { CustomFile } from "./model";

export class CustomFileRepository extends BaseRepository<ICustomFileDocument> {
  constructor() {
    super(CustomFile);
  }
}

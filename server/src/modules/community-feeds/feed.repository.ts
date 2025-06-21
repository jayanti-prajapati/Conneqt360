import { BaseRepository } from "../../shared/base.repository";
import { IPost } from "../../types";
import { Community_Feeds } from "./models";

export class CommunityRepository extends BaseRepository<IPost> {
  constructor() {
    super(Community_Feeds);
  }

  aggregate(pipeline: any[]) {
    return this.model.aggregate(pipeline);
  }
  
}

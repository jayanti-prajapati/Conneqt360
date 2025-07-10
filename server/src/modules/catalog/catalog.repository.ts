import { BaseRepository } from "../../shared/base.repository";
import { ICatalog } from "../../types";
import { Catalog } from "./model";


export class CatalogRepository extends BaseRepository<ICatalog> {
  constructor() {
    super(Catalog);
  }


}

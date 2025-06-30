import { ICustomFile } from "../../types";
import { CustomFile } from "./model";

export class CustomFilesService {
  static async saveFile(data: Partial<ICustomFile>): Promise<string> {
    const file = new CustomFile({
      fileName: data.fileName,
      type: data.type,
      uploadedBy: data.uploadedBy,
      createdAt: data.createdAt ?? new Date(),
    });

    const savedFile = await file.save();

    
    return savedFile._id.toString();
  }
}

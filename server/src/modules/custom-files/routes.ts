import { Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import * as fs from "fs";
import { CustomFilesService } from "./service";

const router = Router();

// Multer storage with correct typings
const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "./uploads/");
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 * 1024 }, // 1GB
});

// Upload endpoint
router.post("/upload-file", upload.single("file"), async (req: Request, res: Response) => {
  req.setTimeout(3600000);

  try {
    const file = req.file as Express.Multer.File;
    if (!file) throw new Error("No file uploaded");

    const { emailAddress, description } = req.body;
    const { originalname, filename, mimetype } = file;
    const filePath = `/uploads/${filename}`;

    const fileId = await CustomFilesService.saveFile({
      fileName: filename,
      type: mimetype,
      uploadedBy: emailAddress,
    });

    res.status(200).json({
      message: "File uploaded successfully!",
      data: {
        fileId,
        emailAddress,
        description,
        originalName: originalname,
        fileName: filename,
        filePath,
        uploadDate: new Date(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error uploading file",
      error: error.message || error,
    });
  }
});

// Fetch file endpoint
router.get("/fetch-doc", async (req: Request, res: Response) => {
  req.setTimeout(3600000);

  try {
    const { fileName } = req.query;
    if (!fileName) throw new Error("File name is required");

    const decodedFileName = decodeURIComponent(fileName as string);
    const sanitizedFileName = path.basename(decodedFileName);
    const uploadsPath = path.resolve(process.cwd(), "uploads");
    const filePath = path.join(uploadsPath, sanitizedFileName);

    if (fs.existsSync(filePath)) {
      res.set("Content-Type", "application/octet-stream");
      return res.sendFile(filePath);
    } else {
      return res.status(404).json({ message: "File not found" });
    }
  } catch (error: any) {
    res.status(500).json({
      message: error?.message || "Error fetching file",
    });
  }
});

export default router;

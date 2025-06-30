import { Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import * as fs from "fs";



const router = Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 * 1024 },
});

router.post("/upload-file",  upload.single("file"), async (req: any, res: Response) => {
  req.setTimeout(3600000);


  try {
    const file = req.file;
    if (!file) {
      throw { message: 'No file uploaded' }
    }

    const { emailAddress, title, description } = req.body;


    const { originalname, filename } = file;
    const filePath = `/uploads/${filename}`;

    // const fileId = await CustomFilesService.saveFile({ masterId, path: filename, createdBy: emailAddress });

    res.status(200).json({
      message: "File uploaded successfully!",
      data: {
        // fileId,
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
      error: error instanceof Error ? error.message : error,
    });
  }
});

router.get("/fetch-doc", async (req: Request, res: Response) => {
  req.setTimeout(3600000);

  try {

    const { fileName } = req.query;

    if (!fileName) {
      throw ({ message: "File name is required1" });
    }

    const decodedFileName = decodeURIComponent(fileName as string);
    const sanitizedFileName = path.basename(decodedFileName); // Prevent directory traversal

    // Use project root relative uploads directory
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
      message: error?.message || "Error fetching file"
    });
  }
});


export default router;
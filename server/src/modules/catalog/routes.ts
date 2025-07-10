import express from "express";
import { CatalogController } from "./controller";


const router = express.Router();
const catalogController = new CatalogController();

router.post("/", (req, res) => catalogController.create(req, res));
router.get("/", (req, res) => catalogController.getAll(req, res));
router.get("/:id", (req, res) => catalogController.getById(req, res));
router.put("/:id", (req, res) => catalogController.update(req, res));
router.delete("/:id", (req, res) => catalogController.delete(req, res));


export default router;

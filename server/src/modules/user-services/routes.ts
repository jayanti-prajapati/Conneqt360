import express from "express";
import { UserServicesController } from "./controller";

const router = express.Router();
const serviceController = new UserServicesController();

router.post("/", (req, res) => serviceController.create(req, res));
router.get("/", (req, res) => serviceController.getAll(req, res));
router.get("/:id", (req, res) => serviceController.getById(req, res));
router.put("/:userId", (req, res) => serviceController.update(req, res));
router.delete("/:id", (req, res) => serviceController.delete(req, res));
router.get("/user/:userId", (req, res) => serviceController.getByUserId(req, res));


export default router;

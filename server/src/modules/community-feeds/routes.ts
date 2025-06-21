import express  from "express";
import { CommunityController } from "./controller";

const router = express.Router();
const communityController = new CommunityController();


router.get("/feeds", (req, res) => communityController.getAllFeeds(req, res));
router.post("/", (req, res) => communityController.create(req, res));
router.get("/", (req, res) => communityController.getAll(req, res));
router.get("/:id", (req, res) => communityController.getById(req, res));
router.put("/:id", (req, res) => communityController.update(req, res));
router.delete("/:id", (req, res) => communityController.delete(req, res));


export default router;
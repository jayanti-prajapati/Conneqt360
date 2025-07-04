import  express  from 'express';
import { ChatController } from './controller';

const router = express.Router();
const chatController = new ChatController();

router.post("/", (req, res) => chatController.sendMessage(req, res));
router.get("/", (req, res) => chatController.getAll(req, res));
router.get("/:userId", (req, res) => chatController.getMessageByUser(req, res));

export default router;
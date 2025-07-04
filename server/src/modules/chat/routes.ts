import  express  from 'express';
import { ChatController } from './controller';

const router = express.Router();
const chatController = new ChatController();

router.get("/list/:userId", (req, res) => chatController.getChatList(req, res));
router.post("/", (req, res) => chatController.sendMessage(req, res));
// router.get("/", (req, res) => chatController.getAll(req, res));

router.get("/:userA/:userB", (req, res) => chatController.getConversation(req, res));

export default router;
import { Router } from 'express';
import { getConversation, getConversationBySender, markRead, sendMessage } from './controler';


const router = Router();

router.post('/send', sendMessage);
router.get('/conversation', getConversation);
router.get('/sender', getConversationBySender);
router.patch('/read/:messageId', markRead);

export default router;
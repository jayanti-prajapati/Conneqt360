import { Router } from 'express';
import { getConversation, sendMessage } from './controler';


const router = Router();

router.post('/send', sendMessage);
router.get('/conversation', getConversation);

export default router;
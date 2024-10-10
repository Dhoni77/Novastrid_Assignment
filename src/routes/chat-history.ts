
import express from 'express';
const multer = require('multer');
import { parseAndInsertChatHistory, filterTasks } from '../controllers/chat-history-controller';
import { authenticate } from '../middlewares';
const router = express.Router();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// Upload endpoint
router.use('/', authenticate)
router.post('/upload', upload.single('file'), parseAndInsertChatHistory);
router.get('/filter', filterTasks);

export default router;

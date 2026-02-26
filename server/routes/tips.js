import express from 'express';
import {
    createTip,
    getAllTips,
    getTipById,
    updateTip,
    deleteTip
} from '../controllers/tipsController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, verifyAdmin, createTip);
router.get('/', getAllTips);
router.get('/:id', getTipById);
router.put('/:id', verifyToken, verifyAdmin, updateTip);
router.delete('/:id', verifyToken, verifyAdmin, deleteTip);

export default router;

import express from 'express';
import {
    createConsultation,
    getAllConsultations,
    getConsultationById,
    replyConsultation,
    updateConsultationStatus,
    getUserConsultations
} from '../controllers/consultationsController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createConsultation);
router.get('/', verifyToken, verifyAdmin, getAllConsultations);
router.get('/my-consultations', verifyToken, getUserConsultations);
router.get('/:id', verifyToken, getConsultationById);
router.put('/:id/reply', verifyToken, verifyAdmin, replyConsultation);
router.put('/:id/status', verifyToken, verifyAdmin, updateConsultationStatus);

export default router;

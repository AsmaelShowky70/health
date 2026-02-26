import express from 'express';
import {
    adminDashboard,
    getAllUsers,
    deleteUser,
    updateUserRole,
    getPendingConsultations,
    getSystemLogs
} from '../controllers/adminController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// جميع مسارات الإدارة تتطلب التحقق من الدخول والصلاحيات
router.get('/dashboard', verifyToken, verifyAdmin, adminDashboard);
router.get('/users', verifyToken, verifyAdmin, getAllUsers);
router.delete('/users/:id', verifyToken, verifyAdmin, deleteUser);
router.put('/users/:id/role', verifyToken, verifyAdmin, updateUserRole);
router.get('/consultations/pending', verifyToken, verifyAdmin, getPendingConsultations);
router.get('/logs', verifyToken, verifyAdmin, getSystemLogs);

export default router;

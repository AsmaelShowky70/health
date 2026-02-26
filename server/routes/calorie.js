import express from 'express';
import {
    calculateCalories,
    saveCalorieResult,
    getUserCalorieHistory
} from '../controllers/calorieController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/calculate', calculateCalories);
router.post('/save', verifyToken, saveCalorieResult);
router.get('/history', verifyToken, getUserCalorieHistory);

export default router;

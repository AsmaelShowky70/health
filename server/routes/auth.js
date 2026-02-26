import express from 'express';
import { register, login, loginUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login-admin', login);
router.post('/login', loginUser);

export default router;

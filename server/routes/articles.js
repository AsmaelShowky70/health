import express from 'express';
import {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle
} from '../controllers/articlesController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, verifyAdmin, createArticle);
router.get('/', getAllArticles);
router.get('/:id', getArticleById);
router.put('/:id', verifyToken, verifyAdmin, updateArticle);
router.delete('/:id', verifyToken, verifyAdmin, deleteArticle);

export default router;

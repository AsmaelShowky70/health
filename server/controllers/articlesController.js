import pool from '../config/database.js';

export const createArticle = async (req, res) => {
    try {
        const { title, content, category, image_url } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({ error: 'العنوان والمحتوى والفئة مطلوبة' });
        }

        const result = await pool.query(
            'INSERT INTO articles (title, content, category, image_url, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
            [title, content, category, image_url || null]
        );

        res.status(201).json({
            message: 'تم إنشاء المقالة بنجاح',
            article: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في إنشاء المقالة' });
    }
};

export const getAllArticles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في الحصول على المقالات' });
    }
};

export const getArticleById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'المقالة غير موجودة' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في الحصول على المقالة' });
    }
};

export const updateArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category, image_url } = req.body;

        const result = await pool.query(
            'UPDATE articles SET title = $1, content = $2, category = $3, image_url = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
            [title, content, category, image_url, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'المقالة غير موجودة' });
        }

        res.json({
            message: 'تم تحديث المقالة بنجاح',
            article: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في تحديث المقالة' });
    }
};

export const deleteArticle = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'المقالة غير موجودة' });
        }

        res.json({ message: 'تم حذف المقالة بنجاح' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في حذف المقالة' });
    }
};

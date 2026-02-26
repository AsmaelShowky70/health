import pool from '../config/database.js';

export const createConsultation = async (req, res) => {
    try {
        const { title, description, age, gender, symptoms } = req.body;
        const userId = req.user.userId;

        if (!title || !description) {
            return res.status(400).json({ error: 'العنوان والوصف مطلوبة' });
        }

        const result = await pool.query(
            'INSERT INTO consultations (user_id, title, description, age, gender, symptoms, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
            [userId, title, description, age || null, gender || null, symptoms || null, 'pending']
        );

        res.status(201).json({
            message: 'تم إرسال الاستشارة بنجاح',
            consultation: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في إرسال الاستشارة' });
    }
};

export const getAllConsultations = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT c.*, u.full_name, u.email FROM consultations c JOIN users u ON c.user_id = u.id ORDER BY c.created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في الحصول على الاستشارات' });
    }
};

export const getConsultationById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT c.*, u.full_name, u.email FROM consultations c JOIN users u ON c.user_id = u.id WHERE c.id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'الاستشارة غير موجودة' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في الحصول على الاستشارة' });
    }
};

export const replyConsultation = async (req, res) => {
    try {
        const { id } = req.params;
        const { reply } = req.body;

        if (!reply) {
            return res.status(400).json({ error: 'الرد مطلوب' });
        }

        const result = await pool.query(
            'UPDATE consultations SET reply = $1, status = $2, replied_at = NOW() WHERE id = $3 RETURNING *',
            [reply, 'replied', id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'الاستشارة غير موجودة' });
        }

        res.json({
            message: 'تم إرسال الرد بنجاح',
            consultation: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في إرسال الرد' });
    }
};

export const updateConsultationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await pool.query(
            'UPDATE consultations SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'الاستشارة غير موجودة' });
        }

        res.json({
            message: 'تم تحديث الاستشارة بنجاح',
            consultation: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في تحديث الاستشارة' });
    }
};

export const getUserConsultations = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await pool.query(
            'SELECT * FROM consultations WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في الحصول على الاستشارات' });
    }
};

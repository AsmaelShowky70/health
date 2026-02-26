import pool from '../config/database.js';

export const adminDashboard = async (req, res) => {
    try {
        const users = await pool.query('SELECT COUNT(*) as count FROM users');
        const articles = await pool.query('SELECT COUNT(*) as count FROM articles');
        const consultations = await pool.query('SELECT COUNT(*) as count FROM consultations');
        const pendingConsultations = await pool.query(
            'SELECT COUNT(*) as count FROM consultations WHERE status = $1',
            ['pending']
        );

        res.json({
            totalUsers: parseInt(users.rows[0].count),
            totalArticles: parseInt(articles.rows[0].count),
            totalConsultations: parseInt(consultations.rows[0].count),
            pendingConsultations: parseInt(pendingConsultations.rows[0].count)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في الحصول على بيانات لوحة التحكم' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, full_name, phone, age, gender, role, created_at FROM users'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في الحصول على المستخدمين' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete related data first
        await pool.query('DELETE FROM consultations WHERE user_id = $1', [id]);
        await pool.query('DELETE FROM calorie_calculations WHERE user_id = $1', [id]);
        await pool.query('DELETE FROM diagnoses WHERE user_id = $1', [id]);

        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'المستخدم غير موجود' });
        }

        res.json({ message: 'تم حذف المستخدم بنجاح' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في حذف المستخدم' });
    }
};

export const getPendingConsultations = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT c.*, u.full_name, u.email FROM consultations c JOIN users u ON c.user_id = u.id WHERE c.status = $1 ORDER BY c.created_at ASC',
            ['pending']
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في الحصول على الاستشارات المعلقة' });
    }
};

export const getSystemLogs = async (req, res) => {
    try {
        const logs = {
            recentActivities: [
                { type: 'article', action: 'created', timestamp: new Date(), user: 'admin' },
                { type: 'consultation', action: 'replied', timestamp: new Date(), user: 'admin' }
            ]
        };
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في الحصول على السجلات' });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // التحقق من أن الدور هو admin أو user فقط
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ error: 'الدور يجب أن يكون admin أو user' });
        }

        const result = await pool.query(
            'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, email, full_name, role',
            [role, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'المستخدم غير موجود' });
        }

        res.json({ message: 'تم تحديث دور المستخدم بنجاح', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في تحديث دور المستخدم' });
    }
};

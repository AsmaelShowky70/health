import pool from './config/database.js';
import bcrypt from 'bcryptjs';

const createNewAdmin = async () => {
    try {
        const email = 'admin@health.com';
        const password = 'Admin123';

        // حذف الحساب القديم إن وجد
        await pool.query('DELETE FROM users WHERE email = $1', [email]);

        // إنشاء حساب جديد
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (email, password_hash, full_name, role, created_at) VALUES ($1, $2, $3, $4, NOW())',
            [email, hashedPassword, 'الإدارة العليا', 'admin']
        );

        console.log('✅ تم إنشاء حساب جديد بنجاح!');
        console.log('📧 البريد: admin@health.com');
        console.log('🔐 كلمة المرور: Admin123');
        process.exit(0);
    } catch (err) {
        console.error('❌ خطأ:', err.message);
        process.exit(1);
    }
};

createNewAdmin();

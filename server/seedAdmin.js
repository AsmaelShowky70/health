import pool from './config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
    try {
        console.log('🔧 جاري إنشاء حساب المسؤول...');

        const adminEmail = process.env.ADMIN_EMAIL || 'asmael@gmail.com';
        const adminPassword = 'Asmel010@#';

        // التحقق من وجود الحساب
        const existingAdmin = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [adminEmail]
        );

        if (existingAdmin.rows.length > 0) {
            console.log('ℹ️ حساب المسؤول موجود بالفعل');
            return;
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // إنشاء حساب المسؤول
        await pool.query(
            'INSERT INTO users (email, password_hash, full_name, role, created_at) VALUES ($1, $2, $3, $4, NOW())',
            [adminEmail, hashedPassword, 'Administrator', 'admin']
        );

        console.log('✅ تم إنشاء حساب المسؤول بنجاح!');
        console.log(`📧 البريد: ${adminEmail}`);
        console.log(`🔐 كلمة المرور: ${adminPassword}`);
    } catch (err) {
        console.error('❌ خطأ في إنشاء حساب المسؤول:', err);
    } finally {
        process.exit(0);
    }
};

seedAdmin();

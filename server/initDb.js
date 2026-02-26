import pool from './config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initializeDatabase = async () => {
    try {
        console.log('🔧 جاري بدء إنشاء قاعدة البيانات...');

        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // تقسيم الـ schema إلى أوامر منفصلة
        const commands = schema.split(';').filter(cmd => cmd.trim());

        for (const command of commands) {
            if (command.trim()) {
                try {
                    await pool.query(command);
                    console.log('✓ تم تنفيذ أمر بنجاح');
                } catch (err) {
                    if (err.message.includes('already exists')) {
                        console.log('ℹ️ الجدول موجود بالفعل');
                    } else {
                        console.error('❌ خطأ في تنفيذ الأمر:', err.message);
                    }
                }
            }
        }

        console.log('✅ تم إنشاء قاعدة البيانات بنجاح!');
    } catch (err) {
        console.error('❌ خطأ في إنشاء قاعدة البيانات:', err);
        process.exit(1);
    }
};

initializeDatabase();

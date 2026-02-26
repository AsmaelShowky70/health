import pool from '../config/database.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/auth.js';

export const register = async (req, res) => {
    try {
        const { email, password, fullName, phone, age, gender } = req.body;

        if (!email || !password || !fullName) {
            return res.status(400).json({ error: 'البريد الإلكتروني والرقم السري والاسم مطلوبة' });
        }

        // Check if user exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'هذا البريد الإلكتروني مسجل بالفعل' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await pool.query(
            'INSERT INTO users (email, password_hash, full_name, phone, age, gender, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING id, email, full_name',
            [email, hashedPassword, fullName, phone, age || null, gender || null, 'user']
        );

        const user = result.rows[0];
        const token = generateToken(user.id, user.email, 'user');

        res.status(201).json({
            message: 'تم إنشاء الحساب بنجاح',
            user: { id: user.id, email: user.email, fullName: user.full_name },
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في التسجيل' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'البريد الإلكتروني والرقم السري مطلوبة' });
        }

        // Find user
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'بيانات الدخول غير صحيحة أو المستخدم غير موجود' });
        }

        const user = result.rows[0];

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'ليس لديك صلاحيات إدارية' });
        }

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
        }

        const token = generateToken(user.id, user.email, user.role);

        res.json({
            message: 'تم تسجيل الدخول بنجاح',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                fullName: user.full_name
            },
            token
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'خطأ في تسجيل الدخول' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'البريد الإلكتروني والرقم السري مطلوبة' });
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
        }

        const token = generateToken(user.id, user.email, user.role);

        res.json({
            message: 'تم تسجيل الدخول بنجاح',
            user: { id: user.id, email: user.email, fullName: user.full_name },
            token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'خطأ في تسجيل الدخول' });
    }
};

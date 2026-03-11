import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// السماح بجميع النطاقات لتجنب مشاكل CORS
app.use(cors({
    origin: function (origin, callback) {
        // السماح دائماً
        callback(null, origin || '*');
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// معالجة طلبات OPTIONS مسبقاً
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import articlesRoutes from './routes/articles.js';
import consultationRoutes from './routes/consultations.js';
import tipsRoutes from './routes/tips.js';
import calorieRoutes from './routes/calorie.js';

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🏥 مرحباً بك في خادم خدمات صحتك الطبي',
        version: '1.0.0',
        status: 'Server is running successfully ✅',
        apiDocs: process.env.API_DOCS_URL || 'https://helth-api.vercel.app/api/health',
        frontend: process.env.FRONTEND_URL || 'https://melodic-monstera-cde782.netlify.app/'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/tips', tipsRoutes);
app.use('/api/calorie', calorieRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        database: 'Connected to Neon PostgreSQL'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'حدث خطأ ما',
        message: process.env.NODE_ENV === 'development' ? err.message : 'خطأ في الخادم'
    });
});

// Only listen if not running on Vercel serverless
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`🏥 خادم الخدمات الطبية يعمل على المنفذ ${PORT}`);
    });
}

// التصدير ليعمل مع Vercel
export default app;

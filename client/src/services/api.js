import axios from 'axios';

// production API hosted on Vercel; falls back to local dev server if not provided
const API_URL = process.env.REACT_APP_API_URL || 'https://helth-api.vercel.app/api';

const api = axios.create({
    baseURL: API_URL,
});

// إضافة التوكن إلى المتطلبات
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// خدمات المصادقة
export const authService = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    loginAdmin: (data) => api.post('/auth/login-admin', data),
};

// خدمات المقالات
export const articlesService = {
    getAll: () => api.get('/articles'),
    getById: (id) => api.get(`/articles/${id}`),
    create: (data) => api.post('/articles', data),
    update: (id, data) => api.put(`/articles/${id}`, data),
    delete: (id) => api.delete(`/articles/${id}`),
};

// خدمات النصائح
export const tipsService = {
    getAll: () => api.get('/tips'),
    getById: (id) => api.get(`/tips/${id}`),
    create: (data) => api.post('/tips', data),
    update: (id, data) => api.put(`/tips/${id}`, data),
    delete: (id) => api.delete(`/tips/${id}`),
};

// خدمات الاستشارات
export const consultationsService = {
    create: (data) => api.post('/consultations', data),
    getAll: () => api.get('/consultations'),
    getById: (id) => api.get(`/consultations/${id}`),
    getUserConsultations: () => api.get('/consultations/my-consultations'),
    reply: (id, data) => api.put(`/consultations/${id}/reply`, data),
    updateStatus: (id, data) => api.put(`/consultations/${id}/status`, data),
};

// خدمات حاسبة السعرات
export const calorieService = {
    calculate: (data) => api.post('/calorie/calculate', data),
    save: (data) => api.post('/calorie/save', data),
    getHistory: () => api.get('/calorie/history'),
};

// خدمات التشخيص
export const diagnosisService = {
    diagnose: (data) => api.post('/diagnosis/diagnose', data),
    save: (data) => api.post('/diagnosis/save', data),
    getHistory: () => api.get('/diagnosis/history'),
};

// خدمات الإدارة
export const adminService = {
    getDashboard: () => api.get('/admin/dashboard'),
    getUsers: () => api.get('/admin/users'),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
    getPendingConsultations: () => api.get('/admin/consultations/pending'),
    getLogs: () => api.get('/admin/logs'),
};

export default api;

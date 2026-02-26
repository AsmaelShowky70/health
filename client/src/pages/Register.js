import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

function Register({ onLogin }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        age: '',
        gender: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await authService.register(formData);
            onLogin(response.data.user, response.data.token, 'user');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'خطأ في التسجيل');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>إنشاء حساب جديد</h2>

                    {error && <div className="alert alert-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">البريد الإلكتروني *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="بريدك الإلكتروني"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">كلمة المرور *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="كلمة المرور قوية"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fullName">الاسم الكامل *</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="اسمك الكامل"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">رقم الهاتف</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="رقم هاتفك"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="age">العمر</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="عمرك"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">الجنس</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">اختر...</option>
                                <option value="male">ذكر</option>
                                <option value="female">انثى</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'جاري التسجيل...' : 'تسجيل'}
                    </button>

                    <p className="auth-link">
                        لديك حساب بالفعل؟ <Link to="/login">سجل دخول</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;

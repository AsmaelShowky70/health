import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import './Auth.css';

function Login({ onLogin }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
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
            const response = await authService.login(formData);
            onLogin(response.data.user, response.data.token, 'user');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'خطأ في تسجيل الدخول');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <form onSubmit={handleSubmit} className="auth-form">
                    <h2>دخول</h2>

                    {error && <div className="alert alert-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">البريد الإلكتروني</label>
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
                        <label htmlFor="password">كلمة المرور</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="كلمة المرور"
                            required
                        />
                    </div>

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'جاري الدخول...' : 'دخول'}
                    </button>

                    <p className="auth-link">
                        ليس لديك حساب؟ <Link to="/register">سجل الآن</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;

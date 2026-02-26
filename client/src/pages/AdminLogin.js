import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import './AdminLogin.css';

function AdminLogin({ onLogin }) {
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
            const response = await authService.loginAdmin(formData);
            if (response.data.user.role === 'admin') {
                onLogin(response.data.user, response.data.token, 'admin');
                navigate('/admin');
            } else {
                setError('صلاحيات غير كافية للوصول إلى لوحة التحكم');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'بيانات الدخول غير صحيحة');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <form onSubmit={handleSubmit} className="admin-login-form">
                    <div className="form-header">
                        <h2>🔐 لوحة التحكم الإدارية</h2>
                        <p>only for administrators</p>
                    </div>

                    {error && <div className="alert alert-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">البريد الإلكتروني</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="admin@example.com"
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
                            placeholder="••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? 'جاري الدخول...' : 'دخول لوحة التحكم'}
                    </button>

                    <div className="admin-warning">
                        ⚠️ الوصول غير المصرح به إلى لوحة التحكم محظور قانوناً
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;

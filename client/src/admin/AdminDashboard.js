import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/api';
import './AdminDashboard.css';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await adminService.getDashboard();
            setStats(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">جاري التحميل...</div>;

    return (
        <div className="admin-dashboard">
            <div className="container">
                <h1 className="page-title">🏥 لوحة التحكم</h1>

                {stats && (
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>👥 المستخدمون</h3>
                            <p className="stat-number">{stats.totalUsers}</p>
                        </div>
                        <div className="stat-card">
                            <h3>📚 المقالات</h3>
                            <p className="stat-number">{stats.totalArticles}</p>
                        </div>
                        <div className="stat-card">
                            <h3>💬 الاستشارات</h3>
                            <p className="stat-number">{stats.totalConsultations}</p>
                        </div>
                        <div className="stat-card pending">
                            <h3>⏳ قيد الانتظار</h3>
                            <p className="stat-number">{stats.pendingConsultations}</p>
                        </div>
                    </div>
                )}

                <div className="admin-menu">
                    <h2>أدوات الإدارة</h2>
                    <div className="menu-grid">
                        <Link to="/admin/articles" className="menu-item">
                            <span className="icon">📝</span>
                            <span className="label">إدارة المقالات</span>
                        </Link>
                        <Link to="/admin/tips" className="menu-item">
                            <span className="icon">💡</span>
                            <span className="label">إدارة النصائح</span>
                        </Link>
                        <Link to="/admin/consultations" className="menu-item">
                            <span className="icon">💬</span>
                            <span className="label">إدارة الاستشارات</span>
                        </Link>
                        <Link to="/admin/users" className="menu-item">
                            <span className="icon">👥</span>
                            <span className="label">إدارة المستخدمين</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;

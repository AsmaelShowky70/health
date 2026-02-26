import React, { useState, useEffect } from 'react';
import { tipsService } from '../services/api';
import './AdminPages.css';

function AdminTips() {
    const [tips, setTips] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTips();
    }, []);

    const fetchTips = async () => {
        try {
            const response = await tipsService.getAll();
            setTips(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await tipsService.create(formData);
            setFormData({ title: '', content: '', category: '' });
            setShowForm(false);
            fetchTips();
        } catch (err) {
            alert('خطأ في إنشاء النصيحة');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل تأكد من حذف هذه النصيحة؟')) {
            try {
                await tipsService.delete(id);
                fetchTips();
            } catch (err) {
                alert('خطأ في حذف النصيحة');
            }
        }
    };

    return (
        <div className="admin-page">
            <div className="container">
                <h1 className="page-title">إدارة النصائح</h1>

                <button className="btn-add" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'إلغاء' : '+ إضافة نصيحة'}
                </button>

                {showForm && (
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-group">
                            <label>العنوان *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>المحتوى *</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="6"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>الفئة *</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'جاري الحفظ...' : 'حفظ النصيحة'}
                        </button>
                    </form>
                )}

                <div className="items-list">
                    {tips.length === 0 ? (
                        <p className="empty">لا توجد نصائح</p>
                    ) : (
                        tips.map(tip => (
                            <div key={tip.id} className="item-card">
                                <div className="item-info">
                                    <h3>{tip.title}</h3>
                                    <p className="category">{tip.category}</p>
                                </div>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(tip.id)}
                                >
                                    حذف
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminTips;

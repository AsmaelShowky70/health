import React, { useState, useEffect } from 'react';
import { articlesService } from '../services/api';
import './AdminPages.css';

function AdminArticles() {
    const [articles, setArticles] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        image_url: ''
    });
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await articlesService.getAll();
            setArticles(response.data);
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
            if (editId) {
                await articlesService.update(editId, formData);
                alert('تم تحديث المقالة بنجاح');
            } else {
                await articlesService.create(formData);
                alert('تم إنشاء المقالة بنجاح');
            }
            setFormData({ title: '', content: '', category: '', image_url: '' });
            setShowForm(false);
            setEditId(null);
            fetchArticles();
        } catch (err) {
            alert(editId ? 'خطأ في تحديث المقالة' : 'خطأ في إنشاء المقالة');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (article) => {
        setFormData({
            title: article.title,
            content: article.content,
            category: article.category,
            image_url: article.image_url || ''
        });
        setEditId(article.id);
        setShowForm(true);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل تأكد من حذف هذه المقالة؟')) {
            try {
                await articlesService.delete(id);
                fetchArticles();
            } catch (err) {
                alert('خطأ في حذف المقالة');
            }
        }
    };

    return (
        <div className="admin-page">
            <div className="container">
                <h1 className="page-title">إدارة المقالات</h1>

                <button 
                    className="btn btn-add" 
                    onClick={() => {
                        if (showForm) {
                            setEditId(null);
                            setFormData({ title: '', content: '', category: '', image_url: '' });
                        }
                        setShowForm(!showForm);
                    }}
                >
                    {showForm ? 'إلغاء' : '+ إضافة مقالة'}
                </button>

                {showForm && (
                    <form onSubmit={handleSubmit} className="admin-form">
                        <h2>{editId ? 'تعديل المقالة' : 'إضافة مقالة جديدة'}</h2>
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
                                rows="8"
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

                        <div className="form-group">
                            <label>رابط الصورة</label>
                            <input
                                type="url"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'جاري الحفظ...' : (editId ? 'تحديث المقالة' : 'حفظ المقالة')}
                        </button>
                    </form>
                )}

                <div className="items-list">
                    {articles.length === 0 ? (
                        <p className="empty">لا توجد مقالات</p>
                    ) : (
                        articles.map(article => (
                            <div key={article.id} className="item-card">
                                <div className="item-info">
                                    <h3>{article.title}</h3>
                                    <p className="category">{article.category}</p>
                                    <p className="content-preview">{article.content.substring(0, 100)}...</p>
                                </div>
                                <div className="item-actions">
                                    <button
                                        className="btn btn-edit"
                                        onClick={() => handleEdit(article)}
                                    >
                                        تعديل
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(article.id)}
                                    >
                                        حذف
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminArticles;

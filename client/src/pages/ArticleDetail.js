import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articlesService } from '../services/api';
import './ArticleDetail.css';

function ArticleDetail() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await articlesService.getById(id);
                setArticle(response.data);
            } catch (err) {
                setError('المقالة غير موجودة');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    if (loading) return <div className="loading">جاري التحميل...</div>;
    if (error) return (
        <div className="error-container">
            <p>{error}</p>
            <Link to="/articles" className="btn">العودة للمقالات</Link>
        </div>
    );
    if (!article) return null;

    return (
        <div className="article-detail-page">
            <div className="container">
                <Link to="/articles" className="back-link">← العودة للمقالات</Link>

                <article className="article-detail">
                    {article.image_url && (
                        <img src={article.image_url} alt={article.title} className="detail-image" />
                    )}
                    <div className="detail-header">
                        <span className="detail-category">{article.category}</span>
                        <h1>{article.title}</h1>
                        <span className="detail-date">
                            تاريخ النشر: {new Date(article.created_at).toLocaleDateString('ar-SA')}
                        </span>
                    </div>
                    <div className="detail-content">
                        {article.content.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </article>
            </div>
        </div>
    );
}

export default ArticleDetail;

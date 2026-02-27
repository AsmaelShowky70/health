import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tipsService } from '../services/api';
import './ArticleDetail.css'; // Reusing same styling as articles for consistency

function TipDetail() {
    const { id } = useParams();
    const [tip, setTip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTip = async () => {
            try {
                const response = await tipsService.getById(id);
                setTip(response.data);
            } catch (err) {
                setError('النصيحة غير موجودة');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTip();
    }, [id]);

    if (loading) return <div className="loading">جاري التحميل...</div>;
    if (error) return (
        <div className="error-container">
            <p>{error}</p>
            <Link to="/tips" className="btn">العودة للنصائح</Link>
        </div>
    );
    if (!tip) return null;

    return (
        <div className="article-detail-page">
            <div className="container">
                <Link to="/tips" className="back-link">← العودة للنصائح</Link>

                <article className="article-detail">
                    <div className="detail-header">
                        <span className="detail-category">{tip.category}</span>
                        <h1>{tip.title}</h1>
                        <span className="detail-date">
                            تاريخ النشر: {new Date(tip.created_at).toLocaleDateString('ar-SA')}
                        </span>
                    </div>
                    <div className="detail-content">
                        {tip.content.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </article>
            </div>
        </div>
    );
}

export default TipDetail;

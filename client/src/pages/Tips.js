import React, { useState, useEffect } from 'react';
import { tipsService } from '../services/api';
import './Tips.css';

function Tips() {
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTips();
    }, []);

    const fetchTips = async () => {
        try {
            const response = await tipsService.getAll();
            setTips(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">جاري التحميل...</div>;

    return (
        <div className="tips-page">
            <div className="container">
                <h1 className="page-title">النصائح الطبية</h1>
                {tips.length === 0 ? (
                    <div className="empty-state">
                        <h3>لا توجد نصائح حالياً</h3>
                    </div>
                ) : (
                    <div className="tips-grid">
                        {tips.map(tip => (
                            <div key={tip.id} className="tip-card">
                                <h3>{tip.title}</h3>
                                <span className="tip-category">{tip.category}</span>
                                <p>{tip.content.substring(0, 150)}...</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tips;

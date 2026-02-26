import React, { useState, useEffect } from 'react';
import { adminService, consultationsService } from '../services/api';
import './AdminPages.css';

function AdminConsultations() {
    const [consultations, setConsultations] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchConsultations();
    }, []);

    const fetchConsultations = async () => {
        try {
            const response = await adminService.getPendingConsultations();
            setConsultations(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReply = async (id) => {
        if (!reply.trim()) {
            alert('يرجى كتابة الرد');
            return;
        }

        setLoading(true);
        try {
            await consultationsService.reply(id, { reply });
            setReply('');
            setSelectedId(null);
            fetchConsultations();
        } catch (err) {
            alert('خطأ في إرسال الرد');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="container">
                <h1 className="page-title">إدارة الاستشارات</h1>

                <div className="items-list">
                    {consultations.length === 0 ? (
                        <p className="empty">لا توجد استشارات معلقة</p>
                    ) : (
                        consultations.map(consultation => (
                            <div key={consultation.id} className="item-card">
                                <div className="item-info">
                                    <h3>{consultation.title}</h3>
                                    <p>
                                        <strong>المستخدم:</strong> {consultation.full_name} ({consultation.email})
                                    </p>
                                    <p>
                                        <strong>الوصف:</strong> {consultation.description}
                                    </p>
                                    <p>
                                        <strong>الحالة:</strong>
                                        <span
                                            className={`status-badge status-${consultation.status}`}
                                        >
                                            {consultation.status}
                                        </span>
                                    </p>

                                    {selectedId === consultation.id && (
                                        <div className="reply-form">
                                            <textarea
                                                value={reply}
                                                onChange={(e) => setReply(e.target.value)}
                                                placeholder="اكتب الرد..."
                                                rows="4"
                                            />
                                            <button
                                                className="btn"
                                                onClick={() => handleReply(consultation.id)}
                                                disabled={loading}
                                            >
                                                {loading ? 'جاري الإرسال...' : 'إرسال الرد'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {selectedId !== consultation.id && (
                                    <button
                                        className="btn"
                                        onClick={() => setSelectedId(consultation.id)}
                                    >
                                        رد
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminConsultations;

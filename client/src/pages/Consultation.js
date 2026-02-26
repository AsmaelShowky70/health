import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { consultationsService } from '../services/api';
import './Consultation.css';

function Consultation() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        age: '',
        gender: '',
        symptoms: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

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
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            await consultationsService.create(formData);
            setMessage({
                type: 'success',
                text: 'تم إرسال استشارتك بنجاح. سيتم الرد عليك قريباً'
            });
            setFormData({
                title: '',
                description: '',
                age: '',
                gender: '',
                symptoms: ''
            });
        } catch (err) {
            setMessage({
                type: 'error',
                text: 'خطأ في إرسال الاستشارة'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="consultation-page">
            <div className="container">
                <h1 className="page-title">استشارة طبية</h1>
                <p className="subtitle">استشر الأطباء المتخصصين في أي مسألة صحية</p>

                <form onSubmit={handleSubmit} className="consultation-form">
                    {message && (
                        <div className={`alert alert-${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="title">عنوان الاستشارة *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="مثال: ألم في الرأس"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">الوصف التفصيلي *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="وصف مفصل للمشكلة التي تعاني منها"
                            rows="6"
                            required
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

                    <div className="form-group">
                        <label htmlFor="symptoms">الأعراض</label>
                        <textarea
                            id="symptoms"
                            name="symptoms"
                            value={formData.symptoms}
                            onChange={handleChange}
                            placeholder="اذكر الأعراض التي تشعر بها"
                            rows="4"
                        />
                    </div>

                    <button type="submit" className="btn" disabled={loading}>
                        {loading ? 'جاري الإرسال...' : 'إرسال الاستشارة'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Consultation;

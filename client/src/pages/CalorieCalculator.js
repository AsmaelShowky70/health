import React, { useState } from 'react';
import { calorieService } from '../services/api';
import './CalorieCalculator.css';

function CalorieCalculator() {
    const [formData, setFormData] = useState({
        age: '',
        gender: 'male',
        weight: '',
        height: '',
        activityLevel: 'moderate',
        healthCondition: 'none'
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

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
            const response = await calorieService.calculate(formData);
            setResult(response.data);
        } catch (err) {
            console.error(err);
            alert('خطأ في الحساب');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="calorie-page">
            <div className="container">
                <h1 className="page-title">حاسبة السعرات الحرارية</h1>
                <p className="subtitle">احسب احتياجاتك اليومية من السعرات الحرارية</p>

                <div className="calculator-wrapper">
                    <form onSubmit={handleSubmit} className="calorie-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="age">العمر *</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="سنة"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="gender">الجنس *</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="male">ذكر</option>
                                    <option value="female">انثى</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="weight">الوزن (كجم) *</label>
                                <input
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    step="0.1"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="height">الطول (سم) *</label>
                                <input
                                    type="number"
                                    id="height"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    placeholder="0"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="activityLevel">مستوى النشاط البدني *</label>
                            <select
                                id="activityLevel"
                                name="activityLevel"
                                value={formData.activityLevel}
                                onChange={handleChange}
                                required
                            >
                                <option value="sedentary">خامل (لا تمارس رياضة)</option>
                                <option value="light">خفيف (1-3 أيام/أسبوع)</option>
                                <option value="moderate">متوسط (3-5 أيام/أسبوع)</option>
                                <option value="active">نشط (6-7 أيام/أسبوع)</option>
                                <option value="veryActive">نشط جداً (تمارين مكثفة)</option>
                            </select>
                        </div>

                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'جاري الحساب...' : 'احسب الآن'}
                        </button>
                    </form>

                    {result && (
                        <div className="result-box">
                            <h2>نتائج حساب السعرات الحرارية</h2>

                            <div className="result-summary">
                                <div className="result-item">
                                    <span className="label">معدل الأيض الأساسي (BMR):</span>
                                    <span className="value">{result.bmr} سعرة/يوم</span>
                                </div>
                                <div className="result-item highlight">
                                    <span className="label">احتياجك اليومي للحفاظ على الوزن:</span>
                                    <span className="value">{result.tdee} سعرة/يوم</span>
                                </div>
                            </div>

                            <div className="recommendations">
                                <h3>احتياجاتك حسب الهدف</h3>
                                <div className="rec-cards">
                                    <div className="rec-card loss">
                                        <h4>إنقاص الوزن</h4>
                                        <p>{result.recommendations.weightLoss} سعرة</p>
                                        <small>نقصان 0.5 كجم أسبوعياً</small>
                                    </div>
                                    <div className="rec-card gain">
                                        <h4>زيادة الوزن</h4>
                                        <p>{result.recommendations.weightGain} سعرة</p>
                                        <small>زيادة 0.5 كجم أسبوعياً</small>
                                    </div>
                                </div>
                            </div>

                            {result.recommendedFoods && (
                                <div className="food-recommendations">
                                    <h3>نصائح غذائية مخصصة</h3>
                                    <div className="advice-box">
                                        <p><strong>نصيحة عامة:</strong> {result.advice}</p>
                                    </div>

                                    <div className="food-lists">
                                        <div className="food-list allowed">
                                            <h4>✅ أطعمة ينصح بها</h4>
                                            <ul>
                                                {result.recommendedFoods.map((food, index) => (
                                                    <li key={index}>{food}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div className="food-list avoided">
                                            <h4>❌ أطعمة يفضل تجنبها</h4>
                                            <ul>
                                                {result.avoidedFoods.map((food, index) => (
                                                    <li key={index}>{food}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CalorieCalculator;

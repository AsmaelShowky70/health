import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home({ user }) {
    const services = [
        {
            id: 1,
            title: 'المقالات الطبية',
            description: 'اقرأ مقالات طبية متخصصة عن أمراض وحالات صحية مختلفة',
            icon: '📚',
            link: '/articles'
        },
        {
            id: 2,
            title: 'النصائح الصحية',
            description: 'احصل على نصائح طبية قيمة لحياة صحية أفضل',
            icon: '💡',
            link: '/tips'
        },
        {
            id: 3,
            title: 'الاستشارة الطبية',
            description: 'استشر الأطباء في أي مسألة صحية تخصك',
            icon: '🩺',
            link: '/consultation'
        },
        {
            id: 4,
            title: 'حاسبة السعرات الحرارية',
            description: 'احسب احتياجاتك اليومية من السعرات الحرارية',
            icon: '⚖️',
            link: '/calorie'
        },
        {
            id: 5,
            title: 'مشخص الأعراض',
            description: 'اعرف الأمراض المحتملة من الأعراض التي تشعر بها',
            icon: '🔍',
            link: '/diagnosis'
        }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>🏥 خدمات صحتك</h1>
                    <p>منصتك الموثوقة للخدمات الطبية والاستشارات الصحية</p>
                    <div className="hero-buttons">
                        <Link to="/consultation" className="btn btn-primary">
                            اطلب استشارة طبية
                        </Link>
                        <Link to="/diagnosis" className="btn btn-secondary">
                            تحقق من الأعراض
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <div className="container">
                    <h2>خدماتنا</h2>
                    <div className="services-grid">
                        {services.map(service => (
                            <Link key={service.id} to={service.link} className="service-card">
                                <div className="service-icon">{service.icon}</div>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2>لماذا نختارنا</h2>
                    <div className="features-grid">
                        <div className="feature">
                            <h3>✓ خدمة موثوقة</h3>
                            <p>معلومات طبية دقيقة من مصادر موثوقة</p>
                        </div>
                        <div className="feature">
                            <h3>✓ استشارات سريعة</h3>
                            <p>احصل على ردود سريعة من الأطباء المتخصصين</p>
                        </div>
                        <div className="feature">
                            <h3>✓ سهولة الاستخدام</h3>
                            <p>واجهة سهلة وبسيطة لجميع المستخدمين</p>
                        </div>
                        <div className="feature">
                            <h3>✓ خصوصيتك</h3>
                            <p>حماية كاملة لبيانات وخصوصيتك الشخصية</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!user && (
                <section className="cta-section">
                    <div className="container">
                        <h2>ابدأ رحلتك الصحية اليوم</h2>
                        <p>إذا لم تكن لديك حساب، سجل الآن واحصل على كل الخدمات</p>
                        <Link to="/register" className="btn btn-large">
                            إنشاء حساب مجاني
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}

export default Home;

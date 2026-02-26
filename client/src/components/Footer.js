import React from 'react';
import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>عن الموقع</h3>
                    <p>
                        موقع شامل للخدمات الطبية يوفر استشارات طبية، مقالات، نصائح طبية، وأدوات صحية مفيدة.
                    </p>
                </div>

                <div className="footer-section">
                    <h3>الخدمات</h3>
                    <ul>
                        <li><a href="/articles">المقالات الطبية</a></li>
                        <li><a href="/tips">النصائح الصحية</a></li>
                        <li><a href="/consultation">الاستشارة الطبية</a></li>
                        <li><a href="/calorie">حاسبة السعرات</a></li>
                        <li><a href="/diagnosis">مشخص الحالات</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>روابط مهمة</h3>
                    <ul>
                        <li><a href="/">الرئيسية</a></li>
                        <li><a href="#privacy">سياسة الخصوصية</a></li>
                        <li><a href="#terms">شروط الاستخدام</a></li>
                        <li><a href="#contact">تواصل معنا</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>تواصل معنا</h3>
                    <ul>
                        <li>📧 البريد: info@healthservices.com</li>
                        <li>📱 الهاتف: +966 50 123 4567</li>
                        <li>📍 الموقع: المملكة العربية السعودية</li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} خدمات صحتك. جميع الحقوق محفوظة.</p>
                <p className="disclaimer">
                    ⚠️ تنبيه: المحتوى الطبي المقدم هنا لأغراض تعليمية فقط ولا يجب أن يحل محل استشارة الطبيب المختص.
                </p>
            </div>
        </footer>
    );
}

export default Footer;

import React from 'react';
import './Legal.css';

function ContactUs() {
    return (
        <div className="legal-page">
            <div className="container">
                <h1>تواصل معنا</h1>
                <div className="contact-info-grid">
                    <div className="contact-card">
                        <h3>البريد الإلكتروني</h3>
                        <p>asmaelmohamed2025@gmail.com</p>
                    </div>
                    <div className="contact-card">
                        <h3>رقم الهاتف</h3>
                        <p>01024275208</p>
                    </div>
                    <div className="contact-card">
                        <h3>الموقع</h3>
                        <p>مصر الشرقية ابوحماد</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;

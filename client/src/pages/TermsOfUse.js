import React from 'react';
import './Legal.css';

function TermsOfUse() {
    return (
        <div className="legal-page">
            <div className="container">
                <h1>شروط الاستخدام</h1>
                <p>باستخدامك لموقع خدمات صحتك، فإنك توافق على الشروط التالية...</p>
                <h2>1. الاستخدام المقبول</h2>
                <p>يجب استخدام الموقع لأغراض قانونية فقط...</p>
                <h2>2. إخلاء المسؤولية</h2>
                <p>المحتوى الطبي المقدم هو لأغراض تعليمية فقط ولا يغني عن استشارة الطبيب...</p>
            </div>
        </div>
    );
}

export default TermsOfUse;

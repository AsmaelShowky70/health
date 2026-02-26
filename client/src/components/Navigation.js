import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css';

function Navigation({ user, isAdmin, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout();
        navigate('/');
    };

    const handleMenuToggle = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    🏥 خدمات صحتك
                </Link>

                <div className="hamburger" onClick={handleMenuToggle}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
                    <li className="nav-item">
                        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
                            الرئيسية
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/articles" className="nav-link" onClick={() => setMenuOpen(false)}>
                            المقالات
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/tips" className="nav-link" onClick={() => setMenuOpen(false)}>
                            النصائح الطبية
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/consultation" className="nav-link" onClick={() => setMenuOpen(false)}>
                            استشارة طبية
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/calorie" className="nav-link" onClick={() => setMenuOpen(false)}>
                            حاسبة السعرات
                        </Link>
                    </li>

                    {isAdmin && (
                        <li className="nav-item">
                            <Link to="/admin" className="nav-link admin-link" onClick={() => setMenuOpen(false)}>
                                لوحة التحكم
                            </Link>
                        </li>
                    )}

                    {!user ? (
                        <>
                            <li className="nav-item">
                                <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                                    دخول
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>
                                    تسجيل جديد
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <span className="nav-user">👤 {user.fullName || user.email}</span>
                            </li>
                            <li className="nav-item">
                                <button className="nav-logout" onClick={handleLogout}>
                                    تسجيل الخروج
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navigation;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import Home from './pages/Home';
import Articles from './pages/Articles';
import Tips from './pages/Tips';
import Consultation from './pages/Consultation';
import CalorieCalculator from './pages/CalorieCalculator';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';

// Admin Pages
import AdminDashboard from './admin/AdminDashboard';
import AdminArticles from './admin/AdminArticles';
import AdminConsultations from './admin/AdminConsultations';
import AdminTips from './admin/AdminTips';
import AdminUsers from './admin/AdminUsers';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

function App() {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // التحقق من المستخدم المسجل بالفعل
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const userRole = localStorage.getItem('role');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAdmin(userRole === 'admin');
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData, token, role) => {
        setUser(userData);
        setIsAdmin(role === 'admin');
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', role);
    };

    const handleLogout = () => {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
    };

    if (loading) {
        return <div className="loading">جاري تحميل التطبيق...</div>;
    }

    return (
        <Router>
            <div className="App">
                <Navigation user={user} isAdmin={isAdmin} onLogout={handleLogout} />

                <main className="main-content">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/articles" element={<Articles />} />
                        <Route path="/tips" element={<Tips />} />
                        <Route path="/consultation" element={<Consultation />} />
                        <Route path="/calorie" element={<CalorieCalculator />} />
                        <Route path="/login" element={<Login onLogin={handleLogin} />} />
                        <Route path="/register" element={<Register onLogin={handleLogin} />} />

                        {/* Admin Routes */}
                        <Route
                            path="/admin-login"
                            element={<AdminLogin onLogin={handleLogin} />}
                        />
                        {isAdmin ? (
                            <>
                                <Route path="/admin" element={<AdminDashboard />} />
                                <Route path="/admin/articles" element={<AdminArticles />} />
                                <Route path="/admin/consultations" element={<AdminConsultations />} />
                                <Route path="/admin/tips" element={<AdminTips />} />
                                <Route path="/admin/users" element={<AdminUsers />} />
                            </>
                        ) : (
                            <Route path="/admin/*" element={<Navigate to="/admin-login" />} />
                        )}

                        {/* Redirect to home for unknown routes */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </Router>
    );
}

export default App;

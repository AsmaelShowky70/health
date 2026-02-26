import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import './AdminPages.css';

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await adminService.getUsers();
            setUsers(response.data);
        } catch (err) {
            console.error(err);
            alert('خطأ في تحميل المستخدمين');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('هل تأكد من حذف هذا المستخدم؟')) {
            try {
                await adminService.deleteUser(id);
                fetchUsers();
                alert('تم حذف المستخدم بنجاح');
            } catch (err) {
                alert('خطأ في حذف المستخدم');
            }
        }
    };

    const handleUpdateRole = async (id, newRole) => {
        const confirmMsg = newRole === 'admin'
            ? 'هل تريد تعيين هذا المستخدم كمسؤول؟'
            : 'هل تريد إزالة صلاحيات الإدارة من هذا المستخدم؟';

        if (window.confirm(confirmMsg)) {
            setUpdatingId(id);
            try {
                await adminService.updateUserRole(id, newRole);
                fetchUsers();
                alert(newRole === 'admin'
                    ? 'تم تعيين المستخدم كمسؤول بنجاح'
                    : 'تم إزالة صلاحيات الإدارة بنجاح');
            } catch (err) {
                alert('خطأ في تحديث دور المستخدم');
                console.error(err);
            } finally {
                setUpdatingId(null);
            }
        }
    };

    if (loading) return <div className="loading">جاري التحميل...</div>;

    return (
        <div className="admin-page">
            <div className="container">
                <h1 className="page-title">إدارة المستخدمين</h1>

                {users.length === 0 ? (
                    <p className="empty">لا توجد مستخدمون</p>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>الاسم</th>
                                    <th>البريد الإلكتروني</th>
                                    <th>الهاتف</th>
                                    <th>العمر</th>
                                    <th>الدور</th>
                                    <th>تاريخ التسجيل</th>
                                    <th>الإجراء</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.full_name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone || '-'}</td>
                                        <td>{user.age || '-'}</td>
                                        <td>
                                            <span className={`role-badge role-${user.role}`}>
                                                {user.role === 'admin' ? 'مسؤول' : 'مستخدم'}
                                            </span>
                                        </td>
                                        <td>{new Date(user.created_at).toLocaleDateString('ar-SA')}</td>
                                        <td>
                                            <div className="actions">
                                                {user.role === 'user' ? (
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={() => handleUpdateRole(user.id, 'admin')}
                                                        disabled={updatingId === user.id}
                                                    >
                                                        تعيين مسؤول
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn btn-warning"
                                                        onClick={() => handleUpdateRole(user.id, 'user')}
                                                        disabled={updatingId === user.id}
                                                    >
                                                        إزالة الإدارة
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(user.id)}
                                                    disabled={updatingId === user.id}
                                                >
                                                    حذف
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminUsers;

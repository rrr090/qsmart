// src/pages/AdminDashboard.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';


function AdminDashboard() {
    const { logout, currentUser } = useAuth(); // Получаем currentUser

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
            console.log('Вы успешно вышли из системы');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    return (
        <div className="admin-dashboard-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h2>Админ-панель</h2>
                    {currentUser && (
                        <p className="admin-email">
                            Добро пожаловать, {currentUser.name || currentUser.email}! {/* <-- ИЗМЕНЕНО ЗДЕСЬ */}
                        </p>
                    )}
                </div>
                <nav className="admin-nav">
                    <ul>
                        <li><Link to="/admin" className="admin-nav-link">Обзор</Link></li>
                        <li><Link to="/admin/opportunities" className="admin-nav-link">Возможности</Link></li>
                        <li><Link to="/admin/opportunities/new" className="admin-nav-link">Добавить возможность</Link></li>
                    </ul>
                </nav>
                <div className="admin-sidebar-footer">
                    <button onClick={handleLogout} className="btn btn-danger admin-logout-btn">Выйти</button>
                </div>
            </aside>

            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}

export default AdminDashboard;
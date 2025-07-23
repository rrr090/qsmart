// src/App.js
import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Импорт страниц вашего приложения
import HomePage from './pages/HomePage'; // Это наша новая Landing Page
import OpportunitiesPage from './pages/OpportunitiesPage';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
// Импорт контекста аутентификации
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Импорт основного CSS-файла
import './App.css'; 

// Импорт страниц админ-панели (вложенные маршруты)
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import OpportunityListAdmin from './pages/admin/OpportunityListAdmin';
import OpportunityForm from './components/OpportunityForm';

// ИМПОРТ: SideNav
import SideNav from './components/SideNav';


function AppContent() {
    const { currentUser, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const footerRef = useRef(null); // Оставлен, так как может использоваться для футера
    const location = useLocation(); // Получаем текущий объект location

    // Определяем, является ли текущая страница главной (Landing Page)
    const isLandingPage = location.pathname === '/';
    // Определяем, должен ли SideNav быть показан (на странице возможностей и админ-панели)
    const showSideNav = location.pathname === '/opportunities' || location.pathname.startsWith('/admin');

    // Функция для переключения состояния мобильного меню
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    // Функция для обработки выхода пользователя
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        }
    };

    // Вспомогательная функция для определения класса NavLink (для активного состояния)
    const getNavLinkClass = ({ isActive }) =>
        isActive ? "nav-link active" : "nav-link";

    // Определяем высоту футера из CSS переменных
    // const footerHeight = 60; // В пикселях, соответствует var(--footer-fixed-height)
    // Динамический расчет min-height для App-main
    // Хедера теперь нет на внутренних страницах, поэтому расчет упрощается
    // const appMainMinHeight = `calc(100vh - ${footerHeight}px)`; // Закомментировано, так как управляется CSS


    return (
        <div className="App">
            {/* --- HEADER: Только на главной странице --- */}
            {isLandingPage && (
                <header className={`App-header landing-header`}> {/* Класс landing-header всегда, когда хедер виден */}
                    <div className="header-content">
                        <NavLink to="/" className="site-logo">
                            Qsmart
                        </NavLink>
                    </div>
                </header>
            )}

            {/* --- КОНТЕЙНЕР ДЛЯ САЙДБАРА И ОСНОВНОГО КОНТЕНТА --- */}
            {/* Этот контейнер будет flex-row для десктопов и flex-column для мобильных */}
            {/* Класс landing-body-content для главной страницы, чтобы убрать padding-top */}
            <div className={`flexcontainerMain ${isLandingPage ? 'landing-body-content' : ''}`}> {/* Изменен класс на flexcontainerMain */}
                {/* --- САЙДБАР (отображается только на странице возможностей и админ-панели) --- */}
                {showSideNav && (
                    <SideNav />
                )}

                {/* --- ОБЛАСТЬ ОСНОВНОГО КОНТЕНТА --- */}
                {/* App-main теперь получает класс 'content-with-sidenav' для стилизации flexcontainer */}
                <main className={`App-main ${showSideNav ? 'content-with-sidenav' : ''}`}> {/* minHeight удален */}
                    <Routes>
                        <Route path="/" element={<HomePage />} /> {/* HomePage теперь Landing Page */}
                        <Route path="/opportunities" element={<OpportunitiesPage />} />
                        <Route path="/admin/login" element={<Login />} />
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<AdminOverviewPage />} />
                            <Route path="opportunities" element={<OpportunityListAdmin />} />
                            <Route path="opportunities/new" element={<OpportunityForm />} />
                            <Route path="opportunities/edit/:id" element={<OpportunityForm />} />
                        </Route>
                        <Route path="*" element={<h2>404 - Страница не найдена</h2>} />
                    </Routes>
                </main>
            </div>

        </div>
    );
}

// ОСНОВНОЙ КОМПОНЕНТ App
function App() {
    return (
        <Router>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
}

export default App;

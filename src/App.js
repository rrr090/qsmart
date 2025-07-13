// src/App.js
import React, { useState, useEffect } from 'react'; // Импортируем useEffect
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';

// Импорт страниц вашего приложения
import HomePage from './pages/HomePage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import AboutPage from './pages/AboutPage';
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

// Этот компонент содержит всю основную логику и UI, которые зависят от AuthContext.
function AppContent() {
    const { currentUser, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // --- НОВОЕ: useEffect для инициализации Twemoji ---
     useEffect(() => {
        console.log("AppContent useEffect: Running for Twemoji initialization.");
        console.log("window.twemoji (initial check):", window.twemoji);

        const twemojiLoadCheck = setTimeout(() => {
            if (window.twemoji) {
                console.log("Twemoji found after delay, parsing document body.");
                window.twemoji.parse(document.body, {
                    folder: 'svg',
                    ext: '.svg',
                    base: '/svg/' // <-- ЭТОТ ПУТЬ ПРАВИЛЕН, ЕСЛИ ВЫ ПОМЕСТИЛИ SVG В public/svg/
                });
            } else {
                console.log("Twemoji still not found after delay. Script might not be loaded or accessible.");
            }
        }, 500);

        return () => clearTimeout(twemojiLoadCheck);
    }, []); // Пустой массив зависимостей означает, что эффект запустится один раз при монтировании

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

    return (
        <div className="App">
            {/* --- HEADER: Содержит только Логотип и Кнопку переключения мобильного меню --- */}
            <header className="App-header">
                <div className="header-content">
                    <NavLink to="/" className="site-logo">
                        Qsmart — твоя площадка для роста.
                    </NavLink>
                    <button
                        className="mobile-menu-toggle"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        ☰
                    </button>
                </div>

                {/* --- МОБИЛЬНОЕ НАВИГАЦИОННОЕ МЕНЮ --- */}
                <nav className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li><NavLink to="/" className={getNavLinkClass} onClick={toggleMobileMenu}>Главная</NavLink></li>
                        <li><NavLink to="/opportunities" className={getNavLinkClass} onClick={toggleMobileMenu}>Все возможности</NavLink></li>
                        <li><NavLink to="/about" className={getNavLinkClass} onClick={toggleMobileMenu}>О нас</NavLink></li>
                        {currentUser && currentUser.role === 'admin' && (
                            <li><NavLink to="/admin" className={getNavLinkClass} onClick={toggleMobileMenu}>Админ-панель</NavLink></li>
                        )}
                        {currentUser ? (
                            <li><button onClick={() => { handleLogout(); toggleMobileMenu(); }} className="nav-link">Выйти</button></li>
                        ) : (
                            <li><NavLink to="/admin/login" className={getNavLinkClass} onClick={toggleMobileMenu}>Войти</NavLink></li>
                        )}
                    </ul>
                </nav>
            </header>

            {/* --- ОСНОВНАЯ НАВИГАЦИЯ (только для десктопов) --- */}
            <nav className="main-navigation">
                <ul className="desktop-nav-list">
                    <li><NavLink to="/" className={getNavLinkClass}>Главная</NavLink></li>
                    <li><NavLink to="/opportunities" className={getNavLinkClass}>Все возможности</NavLink></li>
                    <li><NavLink to="/about" className={getNavLinkClass}>О нас</NavLink></li>
                    {currentUser && currentUser.role === 'admin' && (
                        <li><NavLink to="/admin" className={getNavLinkClass}>Админ-панель</NavLink></li>
                    )}
                    {currentUser ? (
                        <li><button onClick={handleLogout} className="nav-link">Выйти</button></li>
                    ) : (
                        <li><NavLink to="/admin/login" className={getNavLinkClass}>Войти</NavLink></li>
                    )}
                </ul>
            </nav>

            {/* --- ОБЛАСТЬ ОСНОВНОГО КОНТЕНТА --- */}
            <main className="App-main">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/opportunities" element={<OpportunitiesPage />} />
                    <Route path="/about" element={<AboutPage />} />
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

            {/* --- ФУТЕР --- */}
            <footer className="App-footer">
                <div className="footer-left">
                    <a href="https://your-social-media-link.com" target="_blank" rel="noopener noreferrer">@Qsmart</a>
                </div>
                <div className="footer-center">
                    {/* Здесь будет эмодзи флага, который Twemoji заменит на изображение */}
                    <span>🇰🇿</span> Казахстан
                </div>
                <div className="footer-right">
                    &copy; 2025
                </div>
            </footer>
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

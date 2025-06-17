import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import AboutPage from './pages/AboutPage';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext'; 
import './App.css'; 

import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import OpportunityListAdmin from './pages/admin/OpportunityListAdmin';
import OpportunityForm from './components/OpportunityForm';

function HeaderNav({ toggleMobileMenu }) {
    const { currentUser } = useAuth(); 

    // Функция для определения класса NavLink
    const getNavLinkClass = ({ isActive }) =>
        isActive ? "nav-link active" : "nav-link";

    return (
        <>
            <nav className="main-nav desktop-nav">
                <ul>
                    <li>
                        <NavLink to="/" className={getNavLinkClass}>Главная</NavLink>
                    </li>
                    <li>
                        <NavLink to="/opportunities" className={getNavLinkClass}>Все возможности</NavLink>
                    </li>
                    <li>
                        <NavLink to="/about" className={getNavLinkClass}>О нас</NavLink>
                    </li>
                    {/* Ссылка на админ-панель видна только если пользователь авторизован */}
                    {currentUser && (
                        <li>
                            <NavLink to="/admin" className={getNavLinkClass}>Админ-панель</NavLink>
                        </li>
                    )}                     
                </ul>
            </nav>
            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                ☰
            </button>
        </>
    );
}

function App() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <header className="App-header">
                        <div className="header-content">
                            <Link to="/" className="site-logo">
                                QSMART
                            </Link>
                            {/* Используем вынесенный компонент HeaderNav */}
                            <HeaderNav toggleMobileMenu={toggleMobileMenu} />
                        </div>
                        {/* Мобильное меню также используем NavLink */}
                        <nav className={`main-nav mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
                            <ul>
                                <li><NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={toggleMobileMenu}>Главная</NavLink></li>
                                <li><NavLink to="/opportunities" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={toggleMobileMenu}>Все возможности</NavLink></li>
                                <li><NavLink to="/about" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={toggleMobileMenu}>О нас</NavLink></li>
                                
                            </ul>
                        </nav>
                    </header>

                    <main className="App-main">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/opportunities" element={<OpportunitiesPage />} />
                            <Route path="/about" element={<AboutPage />} />

                            {/* Маршрут для страницы входа */}
                            <Route path="/admin/login" element={<Login />} />

                            {/* Защищенные маршруты для админ-панели */}
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            >
                                {/* Вложенные маршруты для админ-панели */}
                                <Route index element={<AdminOverviewPage />} />
                                <Route path="opportunities" element={<OpportunityListAdmin />} />
                                <Route path="opportunities/new" element={<OpportunityForm />} />
                                <Route path="opportunities/edit/:id" element={<OpportunityForm />} />
                            </Route>

                            {/* Маршрут 404 - Страница не найдена */}
                            <Route path="*" element={<h2>404 - Страница не найдена</h2>} />
                        </Routes>
                    </main>

                    <footer className="App-footer">
                        <p>&copy; bzzz090</p>
                    </footer>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
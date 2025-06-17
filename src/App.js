// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import AboutPage from './pages/AboutPage';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

// Импортируем заглушки для новых админских страниц (пока что)
import AdminOverviewPage from './pages/admin/AdminOverviewPage';
import OpportunityListAdmin from './pages/admin/OpportunityListAdmin';
import OpportunityForm from './components/OpportunityForm';

function App() {
    // const { currentUser } = useAuth(); // <--- ЭТУ СТРОКУ УДАЛЯЕМ из App.js
    // Если вам нужен currentUser в App.js (например, для ссылки на админ-панель),
    // то App.js сам должен быть обернут в AuthProvider или useAuth вызывается ниже.
    // Пока что, для упрощения, мы вынесем логику показа ссылки на админ-панель.

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
                            <nav className="main-nav desktop-nav">
                                <ul>
                                    <li><Link to="/">Главная</Link></li>
                                    <li><Link to="/opportunities">Все возможности</Link></li>
                                    <li><Link to="/about">О нас</Link></li>
                                    {/* <AuthStatusLink /> // <--- Здесь можно использовать отдельный компонент для ссылки админки */}
                                    {/* Временное решение: ссылка будет видна всегда, но доступ будет только авторизованным */}
                                    <li><Link to="/admin">Админ-панель</Link></li>
                                </ul>
                            </nav>
                            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                                ☰
                            </button>
                        </div>
                        <nav className={`main-nav mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
                            <ul>
                                <li><Link to="/" onClick={toggleMobileMenu}>Главная</Link></li>
                                <li><Link to="/opportunities" onClick={toggleMobileMenu}>Все возможности</Link></li>
                                <li><Link to="/about" onClick={toggleMobileMenu}>О нас</Link></li>
                                <li><Link to="/admin" onClick={toggleMobileMenu}>Админ-панель</Link></li>
                            </ul>
                        </nav>
                    </header>

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

                    <footer className="App-footer">
                        <p>&copy; bzzz090
                        </p>
                    </footer>
                </div>
            </AuthProvider> 
        </Router>
    );
}

export default App;
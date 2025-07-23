// src/pages/HomePage.js (Теперь это Landing Page)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Создадим этот файл для стилей лендинга

function HomePage() {
    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate('/opportunities'); // Переход на страницу возможностей
    };

    return (
        <div className="landing-page">
            <div className="landing-hero">
                <div className="hero-content">
                    <h1>Откройте свой потенциал с Qsmart</h1>
                    <p>
                        Ваш путь к новым возможностям в образовании, науке и творчестве.
                        Найдите идеальные олимпиады, конкурсы и кружки для школьников.
                    </p>
                    <button className="explore-button" onClick={handleExploreClick}>
                        Найти возможности
                    </button>
                </div>
            </div>

            <section className="landing-features">
                <h2>Почему Qsmart?</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <h3>Широкий выбор</h3>
                        <p>Тысячи возможностей от ведущих организаций и университетов.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Персонализация</h3>
                        <p>Найдите то, что подходит именно вам, с помощью умных фильтров.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Легкий доступ</h3>
                        <p>Вся информация в одном месте, всегда под рукой.</p>
                    </div>
                </div>
            </section>

            <section className="landing-cta">
                <h2>Готовы начать?</h2>
                <p>Не упустите свой шанс на успех. Присоединяйтесь к Qsmart сегодня!</p>
                <button className="cta-button" onClick={handleExploreClick}>
                    Начать поиск
                </button>
            </section>
        </div>
    );
}

export default HomePage;

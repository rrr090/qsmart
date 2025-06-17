import React from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link для навигации
import './HomePage.css'; // Оставим стили для центрирования и кнопки

function HomePage() {
    return (
        <div className="home-page-container minimal"> {/* Добавим класс minimal для специфичных стилей */}
            <section className="hero-section minimal-hero">
                <h1>Откройте мир возможностей для школьников</h1>
                <p>Олимпиады, кружки, конкурсы — всё в одном месте!</p>
                <div className="hero-buttons">
                    {/* Используем Link для навигации внутри React-приложения */}
                    <Link to="/opportunities" className="btn btn-primary">
                        Посмотреть все возможности
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
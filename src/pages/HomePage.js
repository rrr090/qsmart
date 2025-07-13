// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link для навигации
import './HomePage.css'; // Импортируем стили для домашней страницы

function HomePage() {
    return (
        <div className="home-page-container">
            {/* Главная секция-герой с основным заголовком */}
            <section className="main-hero-section">
                <h1>Хочешь участвовать в хакатонах, конкурсах и проектах?</h1>
            </section>

            {/* --- НОВАЯ СЕКЦИЯ: 4-х квадрантная галерея --- */}
            <section className="quadrant-gallery-section">
                {/* 1-й квадрант: Текст */}
                <div className="quadrant-item">
                    <h2>Здесь ты найдешь всё, что поможет развить свои идеи, получить опыт и начать путь к большим достижениям.</h2>
                <Link to="/about" className="btn primary-btn">Принять участие</Link>
                </div>

                {/* 2-й квадрант: Изображение */}
                <div className="quadrant-item image-quadrant">
                    <img src="https://placehold.co/400x300/b4dfe5/303c6c?text=Изображение+1" alt="Изображение возможностей" />
                </div>

                {/* 3-й квадрант: Текст */}
                <div className="quadrant-item image-quadrant">
                    <img src="https://placehold.co/400x300/d2fdff/303c6c?text=Изображение+2" alt="Изображение успеха" />
                </div>

                {/* 4-й квадрант: Изображение */}
                <div className="quadrant-item">
                    <h2>Развивай ум — используй возможности! Находи конкурсы, участвуй в хакатонах, меняй будущее. Qsmart — твоя площадка для роста.</h2>
                    <Link to="/opportunities" className="btn secondary-btn">Найти конкурс</Link>
                </div>
            </section>
        </div>
    );
}

export default HomePage;
